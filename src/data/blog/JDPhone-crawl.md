---
title: 🔧JD手机数据爬虫
description: 使用Python爬取京东上的手机销售数据
author: Johnny
pubDatetime: 2020-06-05T10:26:00Z
featured: false
draft: false
tags:
  - Crawl
---

# 简述

这是我一门大数据相关课程的课程项目，通过爬虫获取京东上手机的销售数据。目前消费市场上的手机品牌多种多样，比较常见的有：苹果，三星，华为，小米，VIVO，OPPO，一加，魅族，努比亚，联想，锤子，诺基亚，索尼，中兴，华硕，黑鲨等，计划通过简单的Python代码爬取京东以“手机”为关键词的前100页商品（搜索上限就是100页）的商品信息，价格，商家，评价数（销量的另一种体现），和链接，并对数据进行清洗和处理，最后存储到MySQL数据库中。

Q:为什么调查的电商平台选择京东？
A:
1. 一开始想选择淘宝作为调查的平台，因为淘宝的商品种类更加丰富。但是淘宝有非常完备的反爬虫机制，简单的爬虫程序很难爬取到有效的数据，而京东对于爬虫没有很严格的限制，选择京东作为调查的电商平台可以减少代码的工作量。

2. 淘宝的刷单现象较为严重，而京东的刷单现象则不是很普遍，选择京东作为调查的电商平台可以让获取的数据更加真实。

3. 京东的售后体系，特别是京东自营的商店，在售后方面更加有保障，而智能手机属于贵重物品，相比于淘宝，更多人倾向在京东购买手机。

# 爬虫分析

![](https://assets.beyh.net/20200605-1.avif)
首先对京东的网页链接进行分析：
![](https://assets.beyh.net/20200605-2.avif)
经过简化后，这个链接也可以正常使用，然后对链接的关键字进行分析：
![](https://assets.beyh.net/20200605-3.avif)
Keyword参数：就是搜索的关键字，这里我们要搜索的关键字就是“手机”。
Enc参数：就是encoding编码的关键字，是网页默认的utf-8，不加这个参数会出现乱码。
Page参数：是当前搜索页面的页数的关键字，第二页显示page=3，规律就是每增加一页，page会增加2，所以页数=page*2-1。
接下来定位网页html代码中商品元素的位置，通过浏览器的开发者工具可以直接定位到商品元素的位置：
![](https://assets.beyh.net/20200605-4.avif)

# 数据库

爬取的信息选择存储到本地的MySQL数据库中，新建数据库包含的列有：爬取商品的序号，手机的名称，手机的价格，手机的评价数（销量）,销售手机的商家，手机的链接。
其中，序号为表的主键，价格和评价数选择使用INT类型存储，其他均采用VARCHAR类型存储。
数据库的结构如下图：
![](https://assets.beyh.net/20200605-5.avif)

# 编写代码

接下来就可以编写代码，主要通过python下的selenium库来对网页进行爬取，其中代码如下：

```python
    from selenium import webdriver
    from selenium.common.exceptions import TimeoutException
    from selenium.webdriver.common.by import By
    from selenium.webdriver.support import expected_conditions as EC
    from selenium.webdriver.support.wait import WebDriverWait
    from multiprocessing.pool import Pool
    from urllib.parse import quote
    from pyquery import PyQuery as pq
    import time
    import pymysql
    import cryptography
    
    a=1
    options = webdriver.ChromeOptions()
    options.add_argument('--headless')
    browser = webdriver.Chrome(chrome_options=options)
    wait = WebDriverWait(browser,10)
    KEYWORD = '手机'#搜索的关键字是手机
    
    headers = {
        'User-Agent':'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36',
        'x-requested-with':'XMLHttpRequest'#用于翻页
    }
    
    def index_page(page):
    
        print('正在爬取第', page, '页')
        try:
            url = 'https://search.jd.com/Search?keyword={}&enc=utf-8&page={}'.format(quote(KEYWORD),page*2-1)
            print(url)
            browser.get(url)
            time.sleep(0.5)
            return browser.page_source
            # browser.close()
        except TimeoutException:
            index_page(page)
    
    def connect_mysql(sql):#写入到MySQL数据库
    
        coon = pymysql.connect(host='localhost',port=3306,user='root',passwd ='123456',db ='phone',charset ='utf8')
        cur = coon.cursor()
        cur.execute(sql)
        if sql.strip()[:6].upper() == 'SELECT':
        res = cur.fetchall()
        else:
        coon.commit()
        res = 'ok'
        cur.close()
        coon.close()
    
        return res
    
    def get_products(html):
        global a
        # html = browser.page_source
        doc = pq(html)
        items = doc('#J_goodsList > ul > li').items()#全部信息都在ul下的li中
        
        for item in items:
            product = {
                '价格': item.find('div > div.p-price > strong > i').text(),#J_goodsList > ul > li:nth-child(1) > div > div.p-price > strong > i
                '评价数': item.find('div > div.p-commit > strong > a').text(),#J_goodsList > ul > li:nth-child(1) > div > div.p-commit > strong > a
                '商家': item.find('div.p-shop > span > a').text(),#J_goodsList > ul > li:nth-child(1) > div > div.p-shop > span > a
                '手机名称': item.find('div > div.p-name.p-name-type-2 > a > em').text(),#J_goodsList > ul > li:nth-child(1) > div > div.p-name.p-name-type-2 > a > em
                '链接': item.find('div > div.p-img > a').attr('href'),#J_goodsList > ul > li:nth-child(1) > div > div.p-img > a
            }
            price=product['价格']
            phone=product['手机名称']
            mark=product['评价数']
            seller=product['商家']
            link=product['链接']
    
            if price.isdigit():
                continue#如果价格不是数字，跳过本次循环
            mark=mark.replace('+','')#单位标准化
            if '万' in mark:
                mark=mark.replace('万','')#单位标准化
                mark=float(mark)
                mark=mark*10000
            else:
                mark=float(mark)
            
            print(product)
            sql="INSERT INTO `phone`.`phone_list` (`序号`,`手机名称`, `价格`, `评价数(销量)`, `商家`, `链接`) VALUES ('"+str(a)+"', '"+phone+"', '"+price+"','"+str(mark)+"','"+seller+"','"+link+"');"
            connect_mysql(sql)
            a+=1
            
    if __name__ == '__main__':
        for i in range(1,101):#循环100次
            get_products(index_page(i))
```

# 结果

最后一共爬取到了3000个商品，存储到数据库后的效果如下：
![](https://assets.beyh.net/20200605-6.avif)
数据采集的任务完成。

- 请注意，本工作完成时间为：2019-12-11，相应的数据可能与现在不同，需注意时效性。