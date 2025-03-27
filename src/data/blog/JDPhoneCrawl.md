---
title: 🔧JD手机数据爬虫
description: 爬取京东上的手机销售数据
author: Johnny
pubDatetime: 2020-06-05T10:26:00Z
featured: false
draft: false
tags:
  - Crawl
---

# 简述

这是我一门大数据相关课程的课程项目，通过爬虫获取京东上手机的销售数据。目前消费市场上的手机品牌多种多样，比较常见的有：苹果，三星，华为，小米，VIVO，OPPO，一加，魅族，努比亚，联想，锤子，诺基亚，索尼，中兴，华硕，黑鲨等，计划通过简单的Python代码爬取京东以“手机”为关键词的前100页商品（搜索上限就是100页）的商品信息，价格，商家，评价数（销量的另一种体现），和链接，并对数据进行清洗和处理，最后存储到MySQL数据库中。

## 为什么选择京东作为调研平台？

选择京东作为电商数据采集平台主要基于以下三个考虑：

### 1. 技术可行性高

虽然淘宝拥有更丰富的商品种类，但其完备的反爬虫机制使得简单爬虫程序难以获取有效数据。相比之下，京东的反爬虫限制相对宽松，可以显著降低开发难度。

### 2. 数据真实可靠

京东平台的刷单现象相对较少，而淘宝的刷单情况则比较普遍。选择京东可以确保采集到的数据更加真实可靠，提高分析结果的准确性。

### 3. 用户购买倾向

对于手机这类高价值电子产品：
- 京东自营商城提供更可靠的售后保障
- 消费者更倾向于在京东等正规渠道购买
- 数据更能反映真实的市场情况

# 爬虫分析

## 网页链接分析

![京东搜索页面](https://assets.beyh.net/20200605-1.avif)

首先对京东的网页链接进行分析：

![链接结构](https://assets.beyh.net/20200605-5.avif)

经过简化后，这个链接也可以正常使用。让我们对链接的关键参数进行分析：

![参数分析](https://assets.beyh.net/20200605-3.avif)

### URL参数说明

- **Keyword参数**：搜索的关键字，本例中为"手机"
- **Enc参数**：encoding编码设置，默认为utf-8，该参数不可省略，否则会出现乱码
- **Page参数**：当前搜索页面的页数，遵循以下规律：
  - 第二页显示page=3
  - 每增加一页，page增加2
  - 页数计算公式：页数 = page * 2 - 1

## 页面元素定位

接下来需要定位网页HTML代码中的商品元素。通过浏览器的开发者工具，我们可以准确定位到商品元素的位置：

![元素定位](https://assets.beyh.net/20200605-4.avif)

# 数据库设计

## 数据存储方案

爬取的数据将存储在本地MySQL数据库中。数据表包含以下字段：

- **序号**：商品爬取序号（主键）
- **手机名称**：产品名称
- **价格**：商品价格
- **评价数**：商品评价数量（反映销量）
- **商家**：销售商家信息
- **链接**：商品详情页链接

## 字段类型设计

- 序号：主键，自增
- 价格、评价数：使用INT类型存储数值
- 其他字段：采用VARCHAR类型存储文本

## 数据库结构示意图

下图展示了数据表的具体结构：

![数据库表结构](https://assets.beyh.net/20200605-2.avif)

# 代码实现

本项目主要使用Python的Selenium库进行网页爬取。完整代码实现如下：

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