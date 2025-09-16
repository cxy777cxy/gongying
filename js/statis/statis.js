// 定义全局变量（仅销售模块所需）
var $;

// 1. 依赖加载（保留echarts核心模块）
layui.use(['form', 'layer', 'laydate', 'echarts', 'echartsTheme'], function() {
    $ = layui.jquery;
    var form = layui.form,
        layer = layui.layer,
        laydate = layui.laydate,
        echarts = layui.echarts; // 初始化echarts变量

    // 2. 日期选择器初始化（ID统一为dateRange，主题色匹配母婴粉色）
    laydate.render({
        elem: '#dateRange', // 与HTML中日期输入框ID一致
        range: true, // 销售模块专属日期范围
        theme: '#ff6b9a' // 匹配母婴系统主色调（粉色）
    });

    // 3. 监听销售搜索（过滤器统一为salesSearchBtn，与HTML按钮一致）
    form.on('submit(salesSearchBtn)', function(data) {
        var result = JSON.stringify(data.field);
        layer.alert('销售搜索条件：<br/>' + result, { title: '销售数据查询', icon: 1 });
        return false;
    });

    // 4. 等待DOM加载完成后初始化销售图表（饼图+柱状图）
    $(document).ready(function() {
        // 初始化图表实例（ID与HTML容器完全对应）
        var productPie = echarts.init(document.getElementById('productSalesPie')); // 产品类别饼图
        var areaPie = echarts.init(document.getElementById('areaSalesPie'));     // 区域销售饼图
        var dailyBar = echarts.init(document.getElementById('dailySalesBar'));   // 近五日柱状图（关键：ID终于对应了）

        // 4.1 产品类别销售占比饼图（统一色系）
        var productPieOpt = {
            title: { 
                text: '产品类别销售占比', 
                x: 'center',
                textStyle: { color: '#333333', fontSize: 16, fontWeight: 500 }
            },
            tooltip: { 
				backgroundColor: 'rgba(240, 240, 240, 0.8)',
                trigger: 'item', 
                formatter: "{a} <br/>{b} : {c}万元 ({d}%)",
                textStyle: { color: '#444444' }
            },
            legend: { 
                orient: 'vertical', 
                left: 'left', 
                data: ['奶粉类', '辅食类', '纸尿裤', '洗护用品', '玩具'],
                textStyle: { color: '#444444', fontSize: 12 }
            },
            series: [{
                name: '销售金额',
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data: [
                    { value: 350, name: '奶粉类' },
                    { value: 250, name: '辅食类' },
                    { value: 200, name: '纸尿裤' },
                    { value: 120, name: '洗护用品' },
                    { value: 80, name: '玩具' }
                ],
                itemStyle: { 
                    color: function(params) {
                        var colorList = [
                            '#A3D9C3', // 薄荷绿（奶粉类）
                            '#8FC9B8', // 深薄荷绿（辅食类）
                            '#F0C0D9', // 藕粉（纸尿裤）
                            '#E6A8C0', // 深藕粉（洗护用品）
                            '#FFE0B3'  // 杏黄（玩具）
                        ];
                        return colorList[params.dataIndex];
                    },
                    emphasis: { 
                        shadowBlur: 8, 
                        shadowOffsetX: 0, 
                        shadowColor: 'rgba(0,0,0,0.12)' 
                    },
                    borderColor: '#FFFFFF',
                    borderWidth: 1
                }
            }]
        };

        // 4.2 区域销售分布饼图（统一色系）
        var areaPieOpt = {
            title: { 
                text: '区域销售分布', 
                x: 'center',
                textStyle: { color: '#333333', fontSize: 16, fontWeight: 500 }
            },
            tooltip: { 
				backgroundColor: 'rgba(240, 240, 240, 0.8)',
                trigger: 'item', 
                formatter: "{a} <br/>{b} : {c}万元 ({d}%)",
                textStyle: { color: '#444444' }
            },
            legend: { 
                orient: 'vertical', 
                left: 'left', 
                data: ['华东地区', '华南地区', '华北地区', '西部地区', '东北地区'],
                textStyle: { color: '#444444', fontSize: 12 }
            },
            series: [{
                name: '销售金额',
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data: [
                    { value: 300, name: '华东地区' },
                    { value: 250, name: '华南地区' },
                    { value: 200, name: '华北地区' },
                    { value: 150, name: '西部地区' },
                    { value: 100, name: '东北地区' }
                ],
                itemStyle: { 
                    color: function(params) {
                        var colorList = [
                            '#99CCFF', // 主色蓝（华东）
                            '#73B3FF', // 深主色蓝（华南）
                            '#C6DFFF', // 雾蓝（华北）
                            '#8FC9B8', // 薄荷绿（西部）
                            '#FFD999'  // 深杏黄（东北）
                        ];
                        return colorList[params.dataIndex];
                    },
                    emphasis: { 
                        shadowBlur: 8, 
                        shadowOffsetX: 0, 
                        shadowColor: 'rgba(0,0,0,0.12)' 
                    },
                    borderColor: '#FFFFFF',
                    borderWidth: 1
                }
            }]
        };

        // 4.3 近五日销量柱状图（关键：数据与标题匹配，ID对应）
        var dailyBarOpt = {
            legend: { 
                data: ['奶粉类', '辅食类', '纸尿裤', '洗护用品', '玩具'], // 图例与品类对应，而非月份
                textStyle: { color: '#444444', fontSize: 12 },
                top: 0
            },
            tooltip: { 
				backgroundColor: 'rgba(240, 240, 240, 0.8)',
                trigger: 'axis', 
                formatter: function(params) {
                            let html = `${params[0].name}<br/>`; // 先显示日期
                            params.forEach(item => {
                                html += `${item.seriesName}：${item.value}件<br/>`;
                            });
                            return html;
                        },
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
                iconStyle: { color: '#ff6b9a' } // 工具图标色匹配主色调（粉色）
            },
            // 数据改为“近五日”维度，与标题一致
            xAxis: { 
                type: 'category',
                data: getRecent5Days(), // 动态获取近5天日期（辅助函数在下方）
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

        // 渲染所有图表（现在柱状图能找到容器了）
        productPie.setOption(productPieOpt);
        areaPie.setOption(areaPieOpt);
        dailyBar.setOption(dailyBarOpt); // 柱状图终于能渲染了！

        // 窗口缩放自适应（所有图表都要加）
        window.onresize = function() {
            productPie.resize();
            areaPie.resize();
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