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

- CPU: Ryzen7 9700X
- 主板: Gigabyte B650M Aorus Pro AX
- 显卡: RX6950XT
- 电源: Revolt 850 SFX
- 内存: BIWIN DW100 16G*2

## Hynix A-die超频

超频到8000C36，顺利通过TM5的1usmus v3测试。除了主时序和`tRFC`、`tREFI`手动指定外，其他时序全部自动，同时开启主板的高带宽模式。具体参数如下：

- 内存电压: 1.5V
- `VDDIO`电压: 1.4V
- `SOC`电压: 1.1V

ZenTiming时序如下图所示。以下是一些重要注意事项（仅供`Zen5`平台参考，其他平台可能不同）：

- `tRAS`参数影响有限：降低数值不会提升性能，反而可能导致不稳定。详见：[tRAS on AMD's AM5 CPUs is weird](https://www.youtube.com/watch?v=BS_NeTwjOvY)
- 海力士A-die关键参数：
  - `tRFC`最低极限约为**480**
  - `tREFI`设置为**65535**时，**480**和**520**的性能差异很小
  - `tRFC2`、`tRFCsb`参数无效
  - 单面内存下`tRDRDSD`、`tRDRDDD`、`tWRWRSD`、`tWRWRDD`参数无效
- 次要时序设置过紧可能导致游戏帧率波动增大

![](https://assets.beyh.net/20250317-1.avif)

受FCLK带宽限制，AIDA64跑分表现并不理想，甚至低于6000频率+2200Mhz FCLK的组合。当前测试在关闭延迟杀手的情况下完成，开启后延迟可降低约5ns。与5年前的Ryzen5 3600相比：
- 写入性能提升明显
- 读取和复制性能提升有限
- 延迟改善不明显

这些结果凸显了AMD FCLK架构的局限性。

## 参考链接

1. [G.skill 2x16GB DDR5-8000 CL38 EXPO optimized memory timings, MSI X870 Tomahawk](https://www.youtube.com/watch?v=zklO7OVVjHQ&t=1562s)
2. [来一点9950X B650M 8000MHz内存作业](https://www.chiphell.com/forum.php?mod=viewthread&tid=2652056)