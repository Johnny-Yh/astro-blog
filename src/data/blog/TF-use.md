---
title: 📖TensorFlow踩坑记录
description: Emm...为什么要选修自然语言处理课
author: Johnny
pubDatetime: 2021-12-21T14:13:47Z
featured: false
draft: false
tags:
  - TensorFlow
---

# 前言

在自然语言处理课程中，有一个实验需要跑（~~参考~~）Github上别人的[项目](https://github.com/Determined22/zh-NER-TF)，需要Python3.6和TensorFlow1.2的环境，我折腾了很久连环境都没有配好,期间也踩了不少坑。后来同学推荐我用[Anaconda](https://github.com/Determined22/zh-NER-TF)来配置，将成功配置的过程记录下来。

# 下载Anaconda

下载链接：[Anaconda | Individual Edition](https://www.anaconda.com/products/individual)

## 创建虚拟环境

创建虚拟环境

`conda create -n tf python=3.6`

查看虚拟环境

`conda info --envs`

激活虚拟环境

`conda activate tf`

然后去Anaconda官网查找需要用TensorFlow包

`type:conda platform:win-64 tensorflow`

安装TensorFlow

`conda install -c dhirschfeld tensorflow`

因为numpy版本过高，还需要降级到1.17版本以下：

`conda install "numpy<1.17"`

现在就可以成功导入TensorFlow模块了！可以把项目跑起来了~

# 感受

有一说一，机器学习的环境是真难配，各种版本要求，一步出错直接重来。一开始我想在WSL上配置这个环境，然后Python下了最新版的3.10，结果无法导入，后来发现目前TensorFlow最高只支持Python3.8，然后后来又想用虚拟机，折腾了半天也不行，真的太搞了。



### 参考链接：

1. [Determined22/zh-NER-TF: A very simple BiLSTM-CRF model for Chinese Named Entity Recognition 中文命名实体识别 (TensorFlow) (github.com)](https://github.com/Determined22/zh-NER-TF)
2. [通过Anaconda配置tensorflow环境 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/383379900)
3. [TensorFlow踩过的坑 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/95615208)