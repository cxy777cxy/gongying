// 定义全局变量（仅销售模块所需）
var $;

// 1. 依赖加载（保留 ECharts 核心模块，删除无用依赖）
layui.use(['form', 'layer', 'laydate', 'echarts'], function() {
    $ = layui.jquery;
    var form = layui.form,
        layer = layui.layer,
        laydate = layui.laydate,
        echarts = layui.echarts; // 初始化 ECharts 变量

    // 2. 日期选择器初始化（若页面无 dateRange 元素，可注释；若后续需要可保留）
    var dateRangeElem = document.getElementById('dateRange');
    if (dateRangeElem) {
        laydate.render({
            elem: '#dateRange',
            range: true,
            theme: '#ff6b9a'
        });
    }

    // 3. 监听销售搜索（若页面无 salesSearchBtn 元素，可注释）
    form.on('submit(salesSearchBtn)', function(data) {
        var result = JSON.stringify(data.field);
        layer.alert('销售搜索条件：<br/>' + result, { title: '销售数据查询', icon: 1 });
        return false;
    });

    // 4. 等待 DOM 加载完成后初始化 ECharts 柱状图（仅保留 dailyBar）
    $(document).ready(function() {
        // 查找柱状图容器（确保容器存在再初始化）
        var dailyBarDom = document.getElementById('dailySalesBar');
        if (!dailyBarDom) {
            layer.msg('未找到柱状图容器', {icon: 2});
            return;
        }

        // 初始化 dailyBar 实例（仅近五日销量柱状图）
        var dailyBar = echarts.init(dailyBarDom);

        // 4.1 近五日销量柱状图配置
        var dailyBarOpt = {
            legend: { 
                data: ['奶粉类', '辅食类', '纸尿裤', '洗护用品', '玩具'],
                textStyle: { color: '#444444', fontSize: 12 },
                top: 0,
                left: 'center'
            },
            tooltip: { 
				backgroundColor: 'rgba(240, 240, 240, 0.8)',
                trigger: 'axis', 
                formatter: "{b} <br/>{a} : {c}件",
                textStyle: { color: '#444444' },
                axisPointer: { type: 'shadow', shadowStyle: { color: 'rgba(0,0,0,0.07)' } }
            },
            toolbox: {
                show: true,
                feature: { 
                    mark: { show: true }, 
                    dataView: { show: true, readOnly: false, textStyle: { color: '#444444' } }, 
                    magicType: { show: true, type: ['line', 'bar'] }, 
                    restore: { show: true }, 
                    saveAsImage: { show: true } 
                },
                iconStyle: { color: '#ff6b9a' } // 匹配主色调粉色
            },
            xAxis: { 
                type: 'category',
                data: getRecent5Days(), // 动态获取近5天日期
                axisLine: { lineStyle: { color: '#D0D0D0' } },
                axisLabel: { color: '#444444', fontSize: 11 }
            },
            yAxis: { 
                name: '销量(万件)',
                nameTextStyle: { color: '#333333', fontSize: 12 },
                axisLine: { lineStyle: { color: '#D0D0D0' } },
                axisLabel: { color: '#444444', fontSize: 11 },
                splitLine: { lineStyle: { color: '#E8E8E8' } }
            },
            series: [
                { type: 'bar', name: '奶粉类', data: [45, 48, 52, 49, 55], itemStyle: { color: '#A3D9C3', borderRadius: [4,4,0,0] } },
                { type: 'bar', name: '辅食类', data: [28, 32, 30, 35, 33], itemStyle: { color: '#8FC9B8', borderRadius: [4,4,0,0] } },
                { type: 'bar', name: '纸尿裤', data: [35, 38, 40, 39, 42], itemStyle: { color: '#F0C0D9', borderRadius: [4,4,0,0] } },
                { type: 'bar', name: '洗护用品', data: [18, 20, 19, 22, 21], itemStyle: { color: '#E6A8C0', borderRadius: [4,4,0,0] } },
                { type: 'bar', name: '玩具', data: [12, 15, 14, 16, 15], itemStyle: { color: '#FFE0B3', borderRadius: [4,4,0,0] } }
            ]
        };

        // 渲染柱状图
        productPie.setOption(productPieOpt);

        // 窗口缩放自适应（仅针对 dailyBar）
        window.onresize = function() {
            dailyBar.resize();
        };
    });

    // 辅助函数：动态获取近5天日期（格式：YYYY-MM-DD）
    function getRecent5Days() {
        var days = [];
        for (let i = 4; i >= 0; i--) { // 从4天前到今天
            var date = new Date();
            date.setDate(date.getDate() - i);
            var year = date.getFullYear();
            var month = String(date.getMonth() + 1).padStart(2, '0'); // 月份补0
            var day = String(date.getDate()).padStart(2, '0'); // 日期补0
            days.push(`${year}-${month}-${day}`);
        }
        return days;
    }

    // 表单渲染（确保下拉框正常显示）
    form.render();
});