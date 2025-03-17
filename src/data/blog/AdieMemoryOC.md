---
title: 🖥️海力士Adie内存超频
description: Hynix Adie颗粒内存超频测试
author: Johnny
pubDatetime: 2025-03-16T14:47:46Z
# modDatetime: 2025-02-25T15:50:00Z
featured: false
draft: false
tags:
  - PC
---

# Hynix A-die

## 测试平台
- CPU:Ryzen7 9700X
- 主板:Gigabyte B650M Aorus Pro AX
- 显卡:RX6950XT
- 电源:Revolt 850 SFX
- 内存:BIWIN DW100 16G*2

## Hynix A-die超频

超频到8000C36，顺利通过TM5的1usmus v3测试，除了主时序和`tRFC`、`tREFI`手动指定外，其他时序全部自动，同时开启主板的高带宽模式，内存电压1.5V，`VDDIO`电压1.4V，`SOC`电压1.1V，ZenTiming时序如下图所示，有几点需要注意的地方，仅供`Zen5`平台参考，其他平台可能不同。

- `tRAS`参数没什么卵用，太低不会提升性能，反而会导致不稳定，参考[tRAS on AMD's AM5 CPUs is weird](https://www.youtube.com/watch?v=BS_NeTwjOvY)
- 海力士A-die的`tRFC`最低极限大约是**480**，`tREFI`设置成**65535**后，**480**和**520**的区别很小，`tRFC2`、`tRFCsb`不生效，单面内存`tRDRDSD`、`tRDRDDD`、`tWRWRSD`、`tWRWRDD`不生效。
- 小参太紧实际的游戏表现可能更不稳定，体现在Low帧波动

![](https://assets.beyh.net/20250317-1.avif)

受限于FCLK的带宽，AIDA64的跑分并没有很高，甚至比不上6000频率+2200Mhz FCLK的搭配，这里的延迟是关闭了延迟杀手的情况下的延迟，开启后会延迟还可以下降5ns左右。对比5年前的Ryzen5 3600的测试，虽然写入提升明显，但是读取复制和延迟的提升都很有限，很难不吐槽AMD辣鸡的FCLK...

# 参考链接：

1. [【内存】单条16G之王！英睿达16G*2 C9BLH颗粒Zen3平台作业](https://www.bilibili.com/read/cv9709830)
2. [DDR4 5500! 英睿达C9BLH超频测试](https://post.smzdm.com/p/adwegr8k/)
3. [G.skill 2x16GB DDR5-8000 CL38 EXPO optimized memory timings, MSI X870 Tomahawk](https://www.youtube.com/watch?v=zklO7OVVjHQ&t=1562s)