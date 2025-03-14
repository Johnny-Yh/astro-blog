---
title: 🖥️内存超频系列
description: 镁光C9颗粒和海力士Adie颗粒的超频测试
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

# Hynix A-die

## 测试平台
- CPU:Ryzen7 9700X
- 主板:Gigabyte B650M Aorus Pro AX
- 显卡:RX6950XT
- 电源:Revolt 850 SFX
- 内存:BIWIN DW100 16G*2

## Hynix A-die超频

成功超频到8000MT/s，内存电压1.45V，SOC电压1.1V，ZenTiming时序如下图所示，有几点需要注意的地方，仅供`Zen5`平台参考，其他平台可能不同。

- `tRAS`参数没什么卵用，直接设置成**126**即可，太低不会提升性能，反而会导致不稳定，参考[tRAS on AMD's AM5 CPUs is weird](https://www.youtube.com/watch?v=BS_NeTwjOvY)
- 海力士A-die的`tRFC`最低极限大约是**480**，`tREFI`设置成**65535**后，**480**和**520**的区别很小，`tRFC2`、`tRFCsb`不生效，设置**Auto**即可；单面内存`tRDRDSD`、`tRDRDDD`、`tWRWRSD`、`tWRWRDD`不生效，设置**Auto**即可。

![](https://assets.beyh.net/210202-8.avif)

Aida64跑分如下，这里的延迟是关闭了延迟杀手的情况下的延迟，开启后会延迟还可以下降，但是对游戏性能可能有负提升。对比5年前的Ryzen5 3600的测试，虽然写入提升明显，但是读取复制和延迟的提升都很有限，AMD辣鸡的FCLK...

![](https://assets.beyh.net/210202-9.avif)

# 参考链接：

1. [【内存】单条16G之王！英睿达16G*2 C9BLH颗粒Zen3平台作业](https://www.bilibili.com/read/cv9709830)
2. [DDR4 5500! 英睿达C9BLH超频测试](https://post.smzdm.com/p/adwegr8k/)
3. [G.skill 2x16GB DDR5-8000 CL38 EXPO optimized memory timings, MSI X870 Tomahawk](https://www.youtube.com/watch?v=zklO7OVVjHQ&t=1562s)