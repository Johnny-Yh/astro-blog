---
title: 🖥️镁光C9内存超频
description: Micron C9BJZ & C9BLH 颗粒内存超频测试
author: Johnny
pubDatetime: 2021-02-02T02:22:47Z
# modDatetime: 2025-02-25T15:50:00Z
featured: false
draft: false
tags:
  - PC
---

# C9BJZ

前一阵子美亚的镁光C9BJZ颗粒内存有折扣，买了两套，一套自己升级用，一套挂在闲鱼出掉了。

![亚马逊](https://assets.beyh.net/210202-1.avif)

## 测试平台

- CPU:Ryzen5 3600
- 主板:Asus X470i
- 显卡:Rx5700
- 电源:SF450
- 内存:Crucial C9BJZ 16G*2

## 相关软件
- [Ryzen Calculator](https://www.techpowerup.com/download/ryzen-dram-calculator/)
- [Zen Timings](https://zentimings.protonrom.com/)
- [Aida64](https://www.aida64.com/downloads)
- [Typhoon Burner](http://www.softnology.biz/)

## C9BJZ超频

可以看到最新版本的台风已经可以正确识别C9BJZ颗粒，但我也没有拆开马甲确认。

![台风](https://assets.beyh.net/210202-2.avif)

最后顺利超到了3800Mhz 16-20-20-14-36，再往上Zen2架构就会分频，效能反而会下降。

![](https://assets.beyh.net/210202-3.avif)

但是玩游戏却发现不是很稳定，会不时有闪退蓝屏等现象，说明还不能很稳定运行，于是稍微放松小参
来到了3800MT/s 18-20-20-18-38 真1T，玩了几个小时PUBG均运行正常，从Aida64的跑分也可以看出和之前并没有很大的差别，日常使用稳定最重要。

![](https://assets.beyh.net/210202-4.avif)

## 参数

最后附上一张所有参数的图片：

![](https://assets.beyh.net/210202-5.avif)

# C9BLH

## 测试平台

- CPU:Ryzen5 5600X
- 主板:Gigabyte B550i
- 显卡:RX6700XT
- 电源:SF600
- 内存:Crucial C9BLH 16G*2

## C9BLH超频

台风已经能正确识别C9BLH颗粒

![](https://assets.beyh.net/210202-6.avif)

C9BLH颗粒相较于C9BJZ颗粒提升明显，可以在1.4V的电压下做到16-18-18-28跑4000MHZ，附上延迟和小参图。

![](https://assets.beyh.net/210202-7.avif)