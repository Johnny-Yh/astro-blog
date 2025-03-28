---
title: 📖笔试记录
description: 记录找实习时做过的笔试
author: Johnny
pubDatetime: 2022-03-19T12:47:00Z
# modDatetime: 2025-02-25T15:50:00Z
featured: false
draft: false
tags:
  - Coding
---

# 前言

最近在找实习，记录一下自己做过的笔试。

# ACM模式输入输出

因为不熟悉ACM模式的输入输出，将踩过的坑都记下来。（C++版本）

- 读入带空格的字符串

  ```c++
  for (int i = 0; i < n; ++i) {
      // 读取带空格的字符串 需要先刷新缓冲区
      fflush(stdin);
      getline(cin, s[i]);
  }
  ```
  
- 测试用例有T组数据

  ```c++
  int main() {
      int T;
      cin >> T;
      // 一共有T组数据
      while (T--) {
          // todo
      }
      return 0;
  }
  ```

# 美团笔试20220319

5题AC了3.3，菜...

## 第一题：点外卖优惠

### 题目描述

小美正在点外卖，平台提供两种优惠机制:

1. 折扣机制：按商品优惠价结算
2. 满减机制：满足"满c元减d元"条件时减免d元

用户只能选择其中一种机制。若选择满减且总价e元不低于满减条件c元，最终支付e-d元。

### 输入格式

- 第一行：正整数n(1≤n≤5000)，表示备选商品数量
- 第二行：n个正整数，第i个数表示第i种商品原价(≤500)
- 第三行：n个正整数，第i个数表示第i种商品折扣价(≤原价) 
- 第四行：正整数m(1≤n≤5000)，表示满减规则数量
- 第五行：m个正整数，第i个数表示第i条规则的满减条件c(1≤c≤1000000)
- 第六行：m个正整数，第i个数表示第i条规则的减免金额d(1≤d≤c)

注：满减规则按c值从小到大排列，数字间用空格分隔

### 输出格式

输出一个长度为n的字符串:
- M：满减更划算
- Z：折扣更划算  
- B：两种机制优惠相同

### 解题思路

模拟计算每种商品组合下的两种优惠方案，满减规则部分可用二分查找优化。

AC代码：

```c++
typedef long long ll;
#include <bits/stdc++.h>
using namespace std;

struct node {
    int c;
    int d;
};

vector<int> price_ori, price_sal;
vector<node> rule;

int main() {
    int n;
    cin >> n;
    price_ori.resize(n);
    price_sal.resize(n);
    for (int i = 0; i < n; ++i) {
        cin >> price_ori[i] >> price_sal[i];
    }
    int m;
    cin >> m;
    rule.resize(m);
    for (int i = 0; i < m; ++i) {
        cin >> rule[i].c >> rule[i].d;
    }

    int ori_pri = 0;// 原价
    int sale_pri = 0;// 折扣价格
    int sub_pri = 0;// 满减价格
    for (int i = 0; i < n; ++i) {
        ori_pri += price_ori[i];
        sale_pri += price_sal[i];
        int j = 0;
        while (j < m && ori_pri >= rule[j].c) ++j;
        if (j == 0) sub_pri = ori_pri;
        else sub_pri = ori_pri - rule[j - 1].d;
        if (sale_pri == sub_pri) {
            cout << "B";
        } else if (sale_pri > sub_pri) {
            cout << "M";
        } else if (sale_pri < sub_pri) {
            cout << "Z";
        }
    }

    return 0;
}
```

## 第二题：神秘代码

### 题目描述

小团在网上冲浪的时候发现了一些神秘代码。经过一段时间的研究，小团发现了这些代码的加密规则。

对于一个长度为n的字符串s，其对应的加密字符串t的生成规则如下：

1. t的第一个字符是s中的第⌈n/2⌉个字符（向上取整）
2. t中第二到第n个字符对应s删去第⌈n/2⌉个字符后所得字符串的加密字符串

也可以用如下流程描述：
- 将t初始化为空串
- 不断从s中取出第⌈n/2⌉个字符并拼接到t后面
- 当s为空时，t即为所求的加密字符串

为了加快破解流程，小团希望你能设计一个命令行工具来帮他进行加密和解密的操作。

### 输入格式

- 第一行：两个正整数n,t(1<=n<=100000,1<=t<=2)
  - n表示字符串长度
  - t表示操作类型(1为加密，2为解密)
- 第二行：长度为n的字符串s，仅由小写英文字母组成

### 输出格式

输出一个长度为n的字符串，表示操作结果。

### 解题思路

按照加密/解密规则反向模拟整个过程。

AC代码：

```c++
typedef long long ll;
#include <bits/stdc++.h>
using namespace std;

string lock (string &s){
    string t;
    while (!s.empty()) {
        int idx = (s.size() - 1) / 2;
        char c = s[idx];
        s.erase(s.begin() + idx);
        t.push_back(c);
    }
    return t;
}

string unlock (string &s){
    string t;
    while (!s.empty()) {
        int idx = (t.size() + 1) / 2;
        char c = s.back();
        s.pop_back();
        t.insert(t.begin() + idx, c);
    }
    reverse(t.begin(), t.end());
    return t;
}

int main() {
    int n, choice;
    cin >> n >> choice;
    string s, t;
    cin >> s;
    if (choice == 1)  t = lock(s);
    else if (choice == 2) t = unlock(s);
    cout << t << endl;
    return 0;
}
```

## 第三题

区间相关的题，题目没有复制下来，也没有AC，后来想了想做法类似于LC[56. 合并区间](https://leetcode-cn.com/problems/merge-intervals/)。

## 第四题：整除问题

### 题目描述

有一个装有n个球的篮子，球的编号从1到n，每个球上写有一个整数。小团需要选择一些球，使其满足以下条件：

1. 所选球上的数之和能被k1整除
2. 所选球上的数之和不能被k2整除  
3. 在满足前两个条件下，所选球上的数之和要尽可能大

同时需要计算满足条件的不同选择方法数量（两种选择方法相同当且仅当选择的球的编号完全相同）。

### 输入格式

- 第一行：三个正整数n, k1, k2 (1 ≤ n ≤ 100000, 1 ≤ k1, k2 ≤ 10)
  - n表示球的数量
  - k1和k2为给定的两个参数
- 第二行：n个整数，表示每个球上写的数（绝对值不超过1000）

### 输出格式

输出两个数（空格分隔）:
1. 满足条件的方案中球上数字之和的最大值
2. 满足条件的方案数量（对998244353取模）

### 解题思路

可以使用动态规划或回溯算法求解。

## 第五题：魔法盒子

### 题目描述

给定一个魔法盒子，它按以下规则工作：

1. 对于序列A，定义(A+1)为将A中每个元素加1得到的新序列
   - 例：[3, 4, 2]+1 = [4, 5, 3]
   - 例：[1, 2, 1]+1 = [2, 3, 2]

2. 对于序列A和B，定义A*B为将两个序列拼接（A在前，B在后）
   - 例：[2, 3, 1]*[1, 2, 1] = [2, 3, 1, 1, 2, 1]
   - 例：[1, 2, 3]*[2, 3]*[5, 4] = [1, 2, 3, 2, 3, 5, 4]

3. 将序列A放入魔法盒子，会得到序列(A+1)*A*(A+2)

### 问题

初始序列为[0]，重复将魔法盒子输出的序列作为输入放入。求第n次操作后输出序列的第k个位置的值。

### 示例

- 初始：[0]
- 第1次：[1, 0, 2] 
- 第2次：[2, 1, 3, 1, 0, 2, 3, 2, 4]
- 第3次：[3, 2, 4, 2, 1, 3, 4, 3, 5, 2, 1, 3, 1, 0, 2, 3, 2, 4, 4, 3, 5, 3, 2, 4, 5, 4, 6]

### 输入格式

一行两个整数n, k，表示操作次数和查询位置。

### 约束条件

- 1 ≤ n ≤ 35
- 1 ≤ k ≤ 3^n

### 输出格式

一个整数，表示第n次操作后序列第k个位置的值。

### 解题思路

使用递归方法求解。

AC代码：

```c++
typedef long long ll;
#include <bits/stdc++.h>
using namespace std;

ll compute(ll n, ll k) {
    if (n == 1) {
        if (k == 1) return 1;
        if (k == 2) return 0;
        if (k == 3) return 2;
    }
    ll sz = pow(3, n);
    if (k > sz * 2 / 3) {
        return compute(n - 1, k - (sz * 2 / 3)) + 2;
    } else if (k > sz / 3 && k <= sz * 2 / 3) {
        return compute(n - 1, k - (sz / 3));
    } else if (k > 0 && k <= sz / 3) {
        return compute(n - 1, k) + 1;
    }
    return -1;
}
int main() {
    ll n, k;
    cin >> n >> k;
    cout << compute(n, k) << endl;
}
```

## 参考链接

[美团笔试 3.19（AK代码）_牛客网 (nowcoder.com)](https://www.nowcoder.com/discuss/868013?type=post&order=recall&pos=&page=1&ncTraceId=&channel=-1&source_id=search_post_nctrack)


# 拼多多笔试20220320

记错了笔试开始的时间，开始了半个小时才进去做...4题A了2.38。

## 第一题

两个数组a和b，可以任意交换数组内元素位置，使得(ai - bi) ^ 2的值最小。

我的做法：签到题，排序一下就行了。

AC代码：

```c++
typedef long long ll;
#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<ll> a(n), b(n);
    for (int i = 0; i < n; ++i) {
        cin >> a[i];
    }
    for (int i = 0; i < n; ++i) {
        cin >> b[i];
    }
    ll res = 0;
    sort(a.begin(), a.end());
    sort(b.begin(), b.end());
    for (int i = 0; i < n; ++i) {
        res += ((a[i] - b[i]) * (a[i] - b[i]));
    }    
    cout << res << endl;
    return 0;   
}
```

## 第二题

有n片瓜田，第i片瓜田在[a<sub>i</sub>, b<sub>i</sub>]时间段内可以结k<sub>i</sub>个瓜，只能在这个时间段内去摘瓜，且每天总共只能摘v个瓜，问最多能摘多少个瓜。

我的做法：贪心，按结束时间降序、开始时间降序、结瓜个数升序的顺序进行排序，然后先拿要烂的瓜。

AC代码：

```c++
typedef long long ll;
#include <bits/stdc++.h>
using namespace std;

struct melon {
    int num;
    int start;
    int end;
};

vector<melon> melons;

int main() {
    int T;
    cin >> T;
    while (T--) {
        int n, v;
        cin >> n >> v;
        melons.resize(n);
        for (int i = 0; i < n; ++i) {
            cin >> melons[i].num >> melons[i].start >> melons[i].end;
        }
        auto cmp = [&](melon &a, melon &b) {
            if (a.end != b.end) return a.end < b.end;
            else if (a.start != b.start) return a.start < b.start;
            else return a.num > b.num;
        };
        sort(melons.begin(), melons.end(), cmp);
        int day = 1, idx = 0, res = 0;
        while (day <= melons[melons.size() - 1].end) {
            if (v > melons[idx].num) {
                res += melons[idx].num;
                ++idx;
            }
            else {
                res += v;
                melons[idx].num -= v;
            }
            ++day;
        }
        cout << res << endl;
    }
}
```

## 第三题

给一个序列A和一个k，生成一个序列B。
1、如果A[i - k] = 1，则B[i] = 1
2、或者A[i + k] = 1，则B[i] = 1
3、否则B[i] = 0

现在给你序列B，要求给出序列A，如果有多种可能，输出字典序最小的。

我的做法：就按照规则反向模拟一遍，但是有问题，只能AC 38%。

我的代码：

```c++
typedef long long ll;
#include <bits/stdc++.h>
using namespace std;

int main() {
    int k;
    string A, B;
    cin >> k >> B;
    int n = B.size();
    A.resize(n, '0');
    for (int i = 0; i < n; ++i) { 
        if (B[i] == '1') {
            if (i + k < n) {
                A[i + k] = '1';
            }
            else if (i - k >= 0) {
                A[i - k] = '1';
            }
        } else if (B[i] == '0') {
            if (i - k >= 0) A[i - k] = '0';
            if (i + k < n) A[i + k] = '0';
        }
    }
    cout << A << endl;
}
```

## 第四题

漂亮字符串：给定一个数字k，如果字符串里每个字符出现的次数都是k的倍数，那么这个字符串是漂亮字符串。

给定字符串和k，求字典序不小于该字符串的漂亮字符串（如果有多个，取字典序最小的）。若找不到符合条件的，输出-1。

这题是[Codeforces Round #705 (Div. 2) C. K-beautiful Strings]([Problem - C - Codeforces](https://codeforces.com/contest/1493/problem/C))原题，当时没时间做了，也没啥思路。

## 参考链接

[拼多多3.20笔试_笔经面经_牛客网 (nowcoder.com)](https://www.nowcoder.com/discuss/868943?type=post&order=create&pos=&page=1&ncTraceId=&channel=-1&source_id=search_post_nctrack)

[拼多多服务端暑期实习笔试_技术交流_牛客网 (nowcoder.com)](https://www.nowcoder.com/discuss/868890?type=post&order=create&pos=&page=1&ncTraceId=&channel=-1&source_id=search_post_nctrack)

# 网易笔试20220327

四题AC了2.5，感觉今天状态好差，牛客上好多人都AK。

## 第一题

有两个怪血量分别为a、b，有两个技能一个是单体伤害x，一个是AOE伤害y，求杀死这两个怪的最少技能数。

这题只AC了86%，很奇怪，我的做法类似于贪心，看哪个伤害可以减血更多（两个怪累计），不贴代码了。



## 第二题

给一个小写字母字符串。
可以标记的条件：相邻两个字母为相同字母，或者是字母表中的相邻字母，例如“aa” "ba" "st"可以被标记，"ad" 不可以被标记，a为1分，b为2分，以此类推，一个字母只能被标记一次。求最高分数。
输入：abb 输出：4
输入：abgcc 输出：a1+b2+c3+c3 = 6

动态规划，就是做的太慢了...

```c++
typedef long long ll;
#define pb push_back
#include <bits/stdc++.h>
#define IO ios_base::sync_with_stdio(0), cin.tie(nullptr), cout.tie(nullptr)
using namespace std;

int main() {
    IO;
    string s;
    cin >> s;
    int n = s.size();
    vector<int> dp(n, 0);
    for (int i = 1; i < n; ++i) {
        if (s[i] == s[i-1] || s[i] - 1 == s[i-1] || s[i] + 1 == s[i-1]) {
            if (i > 1) dp[i] = max(dp[i-1], dp[i-2] + (s[i] - 'a' + 1) + (s[i-1] - 'a' + 1));
            else dp[i] = (s[i] - 'a' + 1) + (s[i-1] - 'a' + 1);
        } else {
            dp[i] = dp[i-1];
        }
    }
    cout << dp[n-1] << endl;
    return 0;
}
```

## 第三题

构建一个完全二叉树，除了根节点之外所有结点和父节点的乘积都为偶数。

我当时的做法是输出时判断父节点是否是奇数，来决定当前结点输出什么，当时只AC了65%。其实根本不用这么麻烦，把奇数全部放到叶子结点上就好了。

```c++
typedef long long ll;
#define pb push_back
#include <bits/stdc++.h>
#define IO ios_base::sync_with_stdio(0), cin.tie(nullptr), cout.tie(nullptr)
using namespace std;

int main() {
    IO;
    int n;
    cin >> n;
    int cur_odd = 1, cur_even = 4; 
        while (cur_even <= n) {
            res.push_back(cur_even);
            cur_even += 2;
        } 
        while (cur_odd <= n) {
            res.push_back(cur_odd);
            cur_odd += 2;
        }
    }
    for (int i = 0; i < n; ++i) {
        if (i == n - 1) cout << res[i] << endl;
        else cout << res[i] << " ";
    }
    return 0;
}
```

## 第四题

就是一个二维沼泽，从草地到沼泽或者沼泽到草地的代价为2，其他为1。求从左上角到右下角的最小路径。（还是最小花费？）当时没时间做了，就没仔细看，后来看大佬题解要用Dijkstra。

## 参考链接

[网易3.27互联网职位笔试 - 力扣](https://leetcode-cn.com/circle/discuss/lWAiDR/)

[0327 网易笔试 - 力扣](https://leetcode-cn.com/circle/discuss/w5pmAf/)

[网易后端2022.3.27题解和笔试情况_牛客网](https://www.nowcoder.com/discuss/914908?channel=-1&source_id=profile_follow_post_nctrack)

[3.27网易笔试情况_牛客网](https://www.nowcoder.com/discuss/914855?type=post&order=recall&pos=&page=1&ncTraceId=&channel=-1&source_id=search_post_nctrack)

[3.27网易杭州研究院笔试_牛客网](https://www.nowcoder.com/discuss/914903?type=post&order=recall&pos=&page=1&ncTraceId=&channel=-1&source_id=search_post_nctrack)

[3.27网易互联网笔试动态规划题解-类比剑指_牛客网](https://www.nowcoder.com/discuss/915001?type=all&order=recall&pos=&page=0&ncTraceId=&channel=-1&source_id=search_all_nctrack)

# 百度笔试20220329

19道单选题，3道编程题，1道不定项，三道编程题AC2.16。

## 第一题

输入一个N和一个K，求N的乘法表的前K列所有数反转的最大值。

比如输入8 9，乘法表8、16、24、32、40、48、56、64、72。反转之后是8、61、42、23、4、84、65、64、27，最大值就是84。

枚举一下就行了。

```c++
#include <bits/stdc++.h>
using namespace std;

int main() {
    int N, K;
    cin >> N >> K;
    vector<int> res(K);
    for (int i = 0; i < K; ++i) {
        string str = to_string(N * (i + 1));
        reverse(str.begin(), str.end());
        res[i] = stoi(str);
    }
    cout << *max_element(res.begin(), res.end()) << endl;
    return 0;   
}
```

## 第二题

输入一个数N，求组合（a，b）的数量，满足a和b互质并且a * b = N，也是枚举一下。

不知道为什么`gcd()`库函数没法用，好在`__gcd()`可以用。

```c++
#include <numeric>
#include <bits/stdc++.h>
using namespace std;

int main() {
    int T;
    cin >> T;
    while (T--) {
        int N;
        cin >> N;
        int res = 0;
        for (int i = 1; i <= (int)sqrt(N); ++i) {
            if (N % i == 0) {
                int a = i, b = N / i;
                if (__gcd(a, b) == 1) ++res;
            }
        }
        cout << res << endl;
    }
    return 0;
}
```

## 第三题

给一个字符串，比如 abcab，每次可以反转一个前缀，比如反转abc得到 cbaab，问反转几次得到字典序排序的aabbc。这道题一开始想法就错了，导致一直在调Bug。应该用BFS暴力枚举来做，后来自己写出来了。

这个问题和前段时间Leetcode上做过的[969. 煎饼排序](https://leetcode-cn.com/problems/pancake-sorting/)很像，但是求最少的次数的话是一个NP-Hard问题，只能够暴力枚举。

```c++
#include <bits/stdc++.h>
using namespace std;

int main() {
    int N, Q;
    cin >> N >> Q;
    while (Q--) {
        string s;
        cin >> s;
        unordered_set<string> st;
        queue<string> q;
        string target = s;
        sort(target.begin(), target.end());
        if (s == target) {
            cout << 0 << endl;
            break;
        }
        int res = 0;
        q.push(s);
        st.insert(s);
        while (!q.empty()) {
            ++res;
            int sz = q.size();
            for (int i = 0; i < sz; ++i) {
                string cur = q.front();
                q.pop();
                for (int j = 1; j < cur.size(); ++j) {
                    string tmp = cur;
                    reverse(tmp.begin(), tmp.begin() + j + 1);
                    if (tmp == target) {
                        cout << res << endl;
                        goto here;
                    }
                    if (!st.count(tmp)) {
                        st.insert(tmp);
                        q.push(tmp);
                    }
                }
            }
        }
        here:;
    }
    return 0;
}
```

## 参考链接

[百度笔试3.29 - 力扣（LeetCode）](https://leetcode-cn.com/circle/discuss/byGSve/)

[题目求助｜前缀反转 - 力扣（LeetCode）](https://leetcode-cn.com/circle/discuss/A7LrKY/)

# 华为笔试20220406

## 参考链接

[4.6 华为笔试题解_笔经面经_牛客网 (nowcoder.com)](https://www.nowcoder.com/discuss/924780?channel=-1&source_id=profile_follow_post_nctrack)

# 微众笔试20220411

## 第一题

```c++
/*
 Kimi同学最近在学习进制转换。众所周知，在表示十六进制数时，除了0-9这九个阿拉伯数字外，
 还引入了“A”、“B”、“C”、“D”、“E”和“F”这六个英文字母
 （不区分大小写）。       现在给你一个十进制正整数，
 请问在将其转换为十六进制之后，对应的十六进制表示中有多少位是字母？
 */
#include <bits/stdc++.h>
using namespace std;

unordered_map<int, char> mp = {{0,'0'},{1,'1'},{2,'2'},{3,'3'},{4,'4'},
{5,'5'},{6,'6'},{7,'7'},{8,'8'},{9,'9'},{10, 'a'},{11,'b'},{12,'c'},
{13,'d'},{14,'e'},{15,'f'}};

int main () {
    int N;
    cin >> N;
    string res;
    while (N) {
        char c = mp[N % 16];
        res.push_back(c);
        N /= 16;
    }
    int cnt = 0;
    for (char &c : res) {
        if (isalpha(c)) ++cnt;
    }
    cout << cnt << endl;
    return 0;
}
```

## 第二题

```c++
/*
小亮来到了一个特殊的国度，这个国家的人有一个奇特的地方：如果一个人身边的人都比自己强，那么这个人会开始努力提升自己。
现在有n个人排成一排，因为视线是有限的，所以每个人只能看见左边的x个人和右边的y个人.
每个人都有一个能力值a_i,如果他视线能看到的人能力值都比他高，则他会开始努力提升自己。
如果左边人数不足x个人，则左边的视线能看见左边所有人，如果右边并没有y个人，那么右边的视线仅仅覆盖右边的所有人。
已知这n个人的编号从左到右为1~n，请问努力的人中最左边的人编号是多少。
保证这n个人的能力值都不重复，且都在10^6以内。
 */
#include <bits/stdc++.h>
using namespace std;

vector<int> nums;

int main () {
    int n, x, y;
    cin >> n >> x >> y;
    nums.resize(n);
    for (int i = 0; i < n; ++i) {
        cin >> nums[i];
    }

    auto cmp = [&](pair<int, int> &a, pair<int, int> &b) {
        return a.first > b.first;
    };

    priority_queue<pair<int, int>, vector<pair<int, int>>, decltype(cmp)> pq1(cmp), pq2(cmp);

    for (int i = 1; i <= y; ++i) {
        pq2.push({nums[i], i});
    }

    for (int i = 0; i < n; ++i) {
        while (!pq1.empty() && (pq1.top().second + x < i)) {
            pq1.pop();
        }
        while (!pq2.empty() && (pq2.top().second <= i)) {
            pq2.pop();
        }
        if ((pq1.empty() || nums[i] < pq1.top().first) &&
        (pq2.empty() || nums[i] < pq2.top().first)) {
            cout << i + 1 << endl;
            return 0;
        }
        pq1.push({nums[i], i});
        if (i + y + 1 < n) {
            pq2.push({nums[i + y + 1], i + y});
        }
    }
    return 0;
}
```

## 第三题

小明有一个长度为n的仅由0到9组成的字符串。小美想知道这个串里有多少个子串代表的十进制数能被k整除。字符串a的子串即是那些可被描述为“由a中第i至第j个字符组成的字符串”的串。如字符串‘121’有‘1’，‘2’，‘1’，‘12’，‘21’，‘121’六个子串。

这题没做出来，用C++不好处理大整数，Java用大整数直接暴力就可以了。