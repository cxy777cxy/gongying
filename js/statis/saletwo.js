// 销售模块全局变量
var $;

// 依赖加载
layui.use(['form', 'layer', 'laydate', 'echarts'], function() {
    $ = layui.jquery;
    var form = layui.form,
        layer = layui.layer,
        laydate = layui.laydate,
        echarts = layui.echarts;

    // 日期选择器初始化
    laydate.render({
        elem: '#dateRange',
        range: true,
        theme: '#ff6b9a' // 匹配母婴系统主色调
    });

    // 监听销售搜索
    form.on('submit(searchSales)', function(data) {
        var result = JSON.stringify(data.field);
        layer.alert('销售搜索条件：<br/>' + result, { title: '销售数据查询', icon: 1 });
        return false;
    });

    // DOM加载完成后初始化图表
    $(document).ready(function() {
        // 初始化产品分类销量饼图
        initProductSalesPie();
        
        // 初始化近五日销量柱状图
        initDailySalesBar();
    });

    // 初始化产品分类销量饼图
    function initProductSalesPie() {
        var pieContainer = document.getElementById('productSalesPie');
        if (!pieContainer) return;
        
        var productPie = echarts.init(pieContainer);
        
        var pieOpt = {
            title: {
                text: '会员等级登记分布',
                left: 'center',
                textStyle: {
                    color: '#ff6b9a',
                    fontSize: 16,
                    fontWeight: 500
                }
            },
            tooltip: {
                trigger: 'item',
                formatter: '{b} <br/>人数：{c} 人（{d}%）'
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: ['青铜会员', '白银会员', '黄金会员', '铂金会员', '钻石会员'],
                textStyle: {
                    color: '#666',
                    fontSize: 12
                }
            },
            series: [{
                name: '登记人数',
                type: 'pie',
                radius: ['40%', '70%'], // 环形饼图
                center: ['50%', '60%'],
                avoidLabelOverlap: false,
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 14,
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                data: [
                    { value: 350, name: '青铜会员' },
                    { value: 280, name: '白银会员' },
                    { value: 220, name: '黄金会员' },
                    { value: 180, name: '铂金会员' },
                    { value: 120, name: '钻石会员' }
                ],
                itemStyle: {
                    color: function(params) {
                        var colorList = [
                            '#ff6b9a',   // 主粉色（食品类）
                            '#ff99b3',   // 浅粉色（用品类）
                            '#ffccd5',   // 超浅粉（服装类）
                            '#8FC9B8',   // 薄荷绿（玩具类）
                            '#FFD999'    // 浅杏黄（洗护类）
                        ];
                        return colorList[params.dataIndex];
                    },
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(255, 107, 154, 0.2)'
                    },
                    borderColor: '#fff',
                    borderWidth: 2
                }
            }]
        };

        productPie.setOption(pieOpt);
        
        // 窗口大小变化时重绘
        window.addEventListener('resize', function() {
            productPie.resize();
        });
    }

    // 初始化近五日销量柱状图
    function initDailySalesBar() {
        var barContainer = document.getElementById('dailySalesBar');
        if (!barContainer) return;
        
        var dailyBar = echarts.init(barContainer);
        var recent5Days = getRecent5Days();
        
        var barOpt = {
            title: {
                text: '近五日会员登记趋势',
                left: 'center',
                textStyle: {
                    color: '#ff6b9a',
                    fontSize: 16,
                    fontWeight: 500
                }
            },
            tooltip: {
				backgroundColor: 'rgba(240, 240, 240, 0.8)',
                trigger: 'axis',
                axisPointer: { type: 'shadow' },
                formatter: '{b} <br/>人数：{c} 人'
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    data: recent5Days,
                    axisLine: {
                        lineStyle: { color: '#ffccd5' }
                    },
                    axisLabel: { color: '#666' }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '登记人数',
                    nameTextStyle: { color: '#ff6b9a' },
                    axisLine: { lineStyle: { color: '#ffccd5' } },
                    splitLine: { lineStyle: { color: '#f9f5f7' } },
                    axisLabel: { color: '#666' }
                }
            ],
            series: [
                {
                    name: '新增会员',
                    type: 'bar',
                    barWidth: '40%',
                    data: [120, 150, 90, 200, 180],
                    itemStyle: {
                        color: function(params) {
                            var colorList = ['#ffccd5', '#ff99b3', '#ff6b9a', '#8FC9B8', '#FFD999'];
                            return colorList[params.dataIndex];
                        },
                        borderRadius: [4, 4, 0, 0]
                    }
                }
            ]
        };

        dailyBar.setOption(barOpt);
        
        // 窗口大小变化时重绘
        window.addEventListener('resize', function() {
            dailyBar.resize();
        });
    }

    // 获取近5天日期（格式：YYYY-MM-DD）
    function getRecent5Days() {
        var days = [];
        for (let i = 4; i >= 0; i--) {
            var date = new Date();
            date.setDate(date.getDate() - i);
            var year = date.getFullYear();
            var month = String(date.getMonth() + 1).padStart(2, '0');
            var day = String(date.getDate()).padStart(2, '0');
            days.push(`${year}-${month}-${day}`);
        }
        return days;
    }

    // 表单渲染
    form.render();
});
