---
title: 📖汽车软件工程Lab
description: 汽车软件工程课程Lab
author: Johnny
pubDatetime: 2022-6-21T15:56:56Z
featured: false
draft: false
tags:
  - Course Lab
---

> 在数据迁移过程中图片文件丢失，所以本篇博客没有图片。

# Lab1

ROS 容器环境的搭建与验

## 实验目的

Autosar（Automotive Open System Architecture，汽车开放系统架构）定义了汽车软件设计规范，提高了汽车软件的复用性、缩短了汽车软件开发周期。现阶段汽车软件设计大部分遵循了SOA（面向服务的架构）的指导思想，Autosar 架构中的运行环境（ara）体现了 SOA 的思想。类似地，ROS（Robot Operating System，机器人操作系统）通过服务（service）体现了 SOA 的思想并规范了汽车软件各模块数据格式，广泛用于自动驾驶领域。 本实验课程旨在通过编写 ROS 应用程序对 ROS 与汽车软件设计相关知识建立初步认识。

## 实验内容

1. 安装 Linux 系统配/虚拟机
2. 配置 ROS kinetc 环境
3. 验证 ROS 样例程序。

## 安装Linux

使用Vmware安装Ubuntu 20.04系统，并配置好系统。

## 安装Docker

```shell
sudo apt install curl
sudo apt-get remove docker docker-engine docker.io   #移除旧版本
sudo apt-get update
curl -fsSL https://mirrors.ustc.edu.cn/docker-ce/linux/ubuntu/gpg | sudo apt-key add -    #添加docker的GPG公匙
sudo add-apt-repository "deb [arch=amd64] https://mirrors.ustc.edu.cn/docker-ce/linux/ubuntu $(lsb_release -cs) stable"     #添加仓库源（此处为中科大源）
sudo apt-get update 
apt-cache policy docker-ce
sudo apt-get install -y docker-ce
sudo docker version   #查看版本（安装完成）
```

## 下载ROS容器镜像

下载 VPN 连接工具， `sudo apt-get install openconnect`

安装Python docker软件，连接VPN并运行脚本拉取镜像

```shell
sudo apt install python3-pip
sudo pip3 install docker
# 先连接VPN
sudo python3 ./run.py
```

## 编译运行样例程序

```shell
mv helloworld_publisher ~/catkin_ws/src/
mv helloworld_subscriber ~/catkin_ws/src/
#分别进入两个文件夹编译样例程序
cd helloworld_publisher
mkdir build && cd build
cmake ..
make -j8
#...
```

两个样例程序全部编译完成后，在容器开启三个终端。首先执行  `roscore`  命令，然后分别执行 `./helloworld_publisher` 与 `./helloword_subscriber` 即可。注意，如果文件夹移动了，需要删除 `build` 目录下的 `CMakeCache.txt` ，再进行 `cmake` ，或者删除重建 `build` 文件夹也可。运行效果如图：

<!-- ![](https://bl6pap004files.storage.live.com/y4mJBMgQjM9xldV2Pn4bEJWX3hrGoxCHhffHAMEigE4Naj_AgCejtLLhDtpDpnqePNOyFBklPb8RtyuLBAXiKeWJfx1a7FwGymM6mfJPzYpNH4ZwWCX3eO8FZujpg9J5tLQ_J-8Vs9SGuF9WY2_0l7-HwH1buhy3MWB0kUsuVI-YP1GL50IMTZCb9l_atqnl_XV?width=1314&height=847&cropmode=none) -->

## 遇到的问题&解决办法

遇到的问题主要集中在Docker下ROS开发环境的配置，包括安装Docker、配置正确版本的Python等，通过查询课程群的讨论和Google搜索引擎来解决。

## 参考链接

[ubuntu 16.04安装（存储库安装）docker-ce_Mackyi的博客-CSDN博客](https://blog.csdn.net/Mackyi/article/details/80969785)

# Lab2

基于 ROS 的通信服务编程实

## 实验目的

本次实验在 ROS 环境下使用基于话题（发布-订阅）的异步通信及基于服务（请求-应 答）的同步通信两种通信方式，编写基本的应用程序，了解基于话题的通信与基于服务的通 信区别以及应用场景。

## 实验内容

1. 编写基于话题通信的应用程序
2. 编写基于服务通信的应用程序
3. 阐述两种通信方式的区别及应用场景

## 编写基于话题的异步通信应用程序

1. 修改发布者与订阅者的通信话题

2. 修改发布者发送消息的频率，并修改发布数据的内容

3. 新增发布者，两个发布者使用不同的话题发送数据，订阅者同时订阅两个话题的数据

修改如图所示的代码即可：

<!-- ![](https://bl6pap004files.storage.live.com/y4m779OzCedHFCjfSyTxrInU36emuvEhir5v-n0Hdghc0lCY7qK297ttLsi1FPlIDbRwGR4tYqKAW8FBxdT_xHS4JJY_wipVWsFsKGByA5Fk6JHcAXC0_pNPfly4y3XLsSCgZRBPdieipATImaJ1An8CBExJvFdt4e3IbU_fqeLeMMlD6Y8nMu3-fnTLnBDZM-d?width=1042&height=752&cropmode=none) -->

## 编写基于服务的同步通信应用程序

实验要求更改示例代码中的.srv 文件，实现自己的服务。我实现的是对三个整数求和并返回，只需要再示例代码的基础上，分别简单修改 `TestAddTwoInts.srv` 、 `server.cpp` 、 `client.cpp` 文件，添加一个变量c即可。运行效果如图：

<!-- ![](https://bl6pap004files.storage.live.com/y4maPUYzlrB_fu7HHEqEg4isVbgqYZekpu61F674DDd57LVRzwnPnSf6MmWUDpEX8--fGQzCAHHitFXvzvTL1RuKfvIv0ZH-IKQr2U4ojlYu_ZRfVVFgwRlaU1Q2-XQDv3Df58_YJf-cYDDbuz154KjQB3-elzshUiokk6g7iiX_-IFpAhiX8F0Sdb4AXp5lQNR?width=1227&height=501&cropmode=none) -->

## 两者之间的区别&应用场景

异步通信（基于话题）是指发布者发布数据后并不关心订阅者是否收到，也不需要等待 订阅者的确认，发布完成后进行后续的任务，并不会阻塞。基于话题的异步通信是单向的，比较适合连续单向发送/接受数据的应用场景。

同步通信（基于服务）是指服务请求方发出请求后进入阻塞状态，直到服务提供方返回 请求结果后才能继续执行后续的操作。基于服务的同步通信是双向的，比较适合需要对请求给出即时响应的应用场景。

## 参考链接

[理解同步和异步通信：以ROS的3中典型通信机制为例_梧桐雪的博客-CSDN博客_同步和异步通讯机制](https://blog.csdn.net/weixin_41855010/article/details/111412416)

# Lab3

基于 ROS 的汽车软件通信中间件性能分析

## 实验目的

本次实验对 ROS1.0 中两种通信机制 TCPROS 与 UDPROS 建立初步了解，并基于 ROS 基于话题（发布-订阅）的异步通信对 ROS1.0 通信性能进行分析，探索影响 ROS1.0 通信性能的变量。

## 实验内容

1. 了解 TCPROS 与 UDPROS 机制
2. 分析消息大小对 ROS 通信性能的影响
3. 分析消息频率对 ROS 通信性能影响
4. 分析订阅者数量对 ROS 通信性
5. 分析不同通信机制对 ROS

## 分析消息频率对通信性能的影响

通过修改 `pub.cpp` 中的 `ros::Rate` 控制发布者发布消息的频率，观察不同频率下通信延迟的变化。依次使用 5HZ、10HZ、20HZ、50HZ，消息大小4MB，使用UDP通信。可以看到随着频率的增加，通信延迟也相应增加了。

<!-- ![](https://bl6pap004files.storage.live.com/y4mSyG4lAojKaw7lmzsw1mEA71mIVZwOIVNTp65yyqpYsYY3tUIgqr5GmAnLhjgsUkpnWNM075m5kyU3O9I7ahx0kXP4WYV52Rfh3ucRsmcrHnMD4mKl7EblRmlOcFEqs33qRCJUJ5HveheGvNHvUExlwBktB-Z03ffpc-uli7SGJ8hw80HcU5hPvh-MTrVRdJ5?width=1200&height=1200&cropmode=none) -->

## 分析消息大小对通信性能的影响

通过修改 `pub.cpp` 中的 `frame_id` 的数据大小，观察不同消息大小下通信延迟的变化。消息大小运用了 C++中的 `std::string` ，`std::string` 里的元素由一个个 `char` 类型 组成，一个 `char` 类型大小正好为 1 字节，所以只需要将 `string` 里的元素填充至固定长度即可模拟消息的大小。消息大小分别选择 1KB、100KB、1M、4M ，通信频率统一为10HZ，使用UDP通信。可以看到随着消息大小的增加，通信延迟也相应增加了。

<!-- ![](https://bl6pap004files.storage.live.com/y4m7UGoNUH3c1TtrRX6_VlyRL8kDI9UqExL80eMCrg1CyVzf1xS6Yeqsi87q8REryVSFQulx1JIxXvBejSDBUEyLEshNACQY5Q2cm0yFLdMbYsrIljFZVqMmor3SecWCBv-9K9UZ8qPLNV0mlYmtJa84wP31JHlgJlLLcgFAg9bCpSFpZnes_b6ak7swzbnGag_?width=1200&height=1200&cropmode=none) -->

## 分析通信方式对通信性能的影响

通过修改 `sub.cpp` 中的订阅者通信方式为 `UDP`，观察不同通信方式下通信延迟的变化， 更 换 为 `UDP` 通 信 方 式 只 需 要 在 `ros::Subscriber` 的 构 造 函 数 最 后 加 上`ros::TransportHints().unreliable().maxDatagramSize` 即可。消息大小为4M ，通信频率统一为10HZ。 `maxDatagramSize` 分别为100、500、1000。可以看出TCP通信延迟最低，在UDP通信中，随着 `maxDatagramSize` 的增加，通信延迟也随着降低。

<!-- ![](https://bl6pap004files.storage.live.com/y4mkUJGzIytt09aS7FKVwGe6xMnYYoeVSqX9Nuv7teDKUTCpKC-7LP1intpHQ8sz9paREn1jTETATPD5WVLI_aKwIfPx0C-E-T5-A31_bN7cpz-WNeb9_7cQLzT257-wGhfY5AbT4fQI-NBhyK6yIHXWswaJXPPcWvOrrO5qFJXIj_freXa-Q37Yx9kfCMoTNkg?width=1200&height=1200&cropmode=none) -->

## 分析消息订阅者数量对通信性能的影响

新增订阅者的代码已经放在例子中，有一个写好的模板，只需要照抄已有的订阅者代码即可。消息大小为4M ，通信频率统一为10HZ，使用UDP通信，`maxDatagramSize` 为100。可以看到随着订阅者数量增加，通信延迟也会增加。

<!-- ![](https://bl6pap004files.storage.live.com/y4mdRuE055OFwboceAWOVeF9Ra4V1n65Kjjo2VpAG2l50IIVgSWEUFWVjl4Zc_lpppx2Blmg164SUGmmp6gvHo5HkEV8VZS7HV41H56Nv1j7PL24pSOZilU2PUKuEY8wDxAz-xiJY-2-YeC7ThmOzBgYFBXkh32_QT59wL5xUy5O0OgqzPLhHIi47AGc8SB08rv?width=1200&height=610&cropmode=none) -->
