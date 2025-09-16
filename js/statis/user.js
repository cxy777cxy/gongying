// 定义全局变量（保留折线图实例，用于更新）
var $, echarts_line;

// 1. 依赖加载（保留echarts核心模块）
layui.use(['form', 'layer', 'laydate', 'echarts', 'echartsTheme'], function() {
    $ = layui.jquery;
    var form = layui.form,
        layer = layui.layer,
        laydate = layui.laydate,
        echarts = layui.echarts; // 初始化echarts变量

    // 2. 日期选择器初始化（用户模块：月份范围选择，主色#99CCFF）
    laydate.render({
        elem: '#daterange',
        type: 'month',
        range: '~',
        theme: '#99CCFF' // 统一主色
    });

    // 3. 监听用户搜索（仅保留用户搜索按钮监听）
    form.on('submit(data-search-btn2)', function(data) {
        var result = JSON.stringify(data.field);
        layer.alert('用户搜索条件：<br/>' + result, { title: '会员数据查询', icon: 1 });
        // 搜索后更新折线图（用户模块专属功能）
        updateLineChart(data.field);
        return false;
    });

    // 4. 等待DOM加载完成后初始化用户折线图
    $(document).ready(function() {
        // 初始化折线图实例（全局变量，用于后续更新）
        echarts_line = echarts.init(document.getElementById('userGrowthLine'));

        // 4.1 近6个月会员增长折线图（统一色系）
        var lineOpt = {
            title: { 
                text: '母婴会员增长趋势（近6个月）', 
                left: 'center',
                textStyle: { color: '#333333', fontSize: 16, fontWeight: 500 }
            },
            tooltip: { 
				backgroundColor: 'rgba(240, 240, 240, 0.8)',
                trigger: 'axis', 
                formatter: "{b} <br/>{a} : {c}人",
                textStyle: { color: '#444444' }
            },
            legend: { 
                data: ['普通会员', '银卡会员', '金卡会员', '钻石会员'], 
                bottom: 10,
                textStyle: { color: '#444444', fontSize: 12 }
            },
            grid: { left: '3%', right: '4%', bottom: '15%', containLabel: true },
            toolbox: {
                show: true,
                feature: { 
                    dataView: { show: true, readOnly: false, textStyle: { color: '#444444' } }, 
                    restore: { show: true }, 
                    saveAsImage: { show: true }, 
                    magicType: { show: true, type: ['line', 'bar'] } 
                },
                iconStyle: { color: '#5A93D8' } // 工具图标色
            },
            xAxis: { 
                type: 'category', 
                boundaryGap: false, 
                data: ['4月', '5月', '6月', '7月', '8月', '9月'],
                axisLine: { lineStyle: { color: '#D0D0D0' } },
                axisLabel: { color: '#444444', fontSize: 11 }
            },
            yAxis: { 
                type: 'value', 
                name: '新增会员数（人）', 
                min: 0, 
                nameTextStyle: { color: '#333333', fontSize: 12 },
                axisLine: { lineStyle: { color: '#D0D0D0' } },
                axisLabel: { 
                    formatter: '{value}人',
                    color: '#444444', 
                    fontSize: 11 
                },
                splitLine: { lineStyle: { color: '#E8E8E8' } }
            },
            series: [
                { 
                    name: '普通会员', 
                    type: 'line', 
                    data: [280, 320, 350, 380, 420, 450], 
                    smooth: true, 
                    lineStyle: { width: 3, color: '#99CCFF' } // 主色蓝
                },
                { 
                    name: '银卡会员', 
                    type: 'line', 
                    data: [120, 150, 180, 210, 230, 260], 
                    smooth: true, 
                    lineStyle: { width: 3, color: '#A3D9C3' } // 薄荷绿
                },
                { 
                    name: '金卡会员', 
                    type: 'line', 
                    data: [60, 75, 90, 105, 120, 135], 
                    smooth: true, 
                    lineStyle: { width: 3, color: '#F0C0D9' } // 藕粉
                },
                { 
                    name: '钻石会员', 
                    type: 'line', 
                    data: [20, 30, 45, 55, 70, 85], 
                    smooth: true, 
                    lineStyle: { width: 3, color: '#FFE0B3' } // 杏黄
                }
            ]
        };

        // 渲染折线图
        echarts_line.setOption(lineOpt);

        // 窗口缩放自适应（仅用户折线图）
        window.onresize = function() {
            echarts_line.resize();
        };
    });

    // 5. 用户模块专属：根据搜索条件更新折线图数据
    function updateLineChart(params) {
        layer.load(2, { shade: 0.1 });
        setTimeout(() => {
            layer.closeAll('loading');
            if (params.major2) {
                const typeMap = { 1: '普通会员', 2: '银卡会员', 3: '金卡会员', 4: '钻石会员' };
                const typeName = typeMap[params.major2];
                echarts_line.setOption({
                    legend: { data: [typeName], textStyle: { color: '#444444' } },
                    series: [{
                        name: typeName,
                        type: 'line',
                        data: [150, 180, 220, 250, 280, 320],
                        smooth: true,
                        lineStyle: { width: 3, color: getColor(params.major2) }
                    }]
                });
                layer.msg(`已更新【${typeName}】趋势`, { icon: 1 });
            } else {
                // 恢复全量数据（统一色系）
                echarts_line.setOption({
                    legend: { 
                        data: ['普通会员', '银卡会员', '金卡会员', '钻石会员'],
                        textStyle: { color: '#444444', fontSize: 12 }
                    },
                    series: [
                        { name: '普通会员', type: 'line', data: [280, 320, 350, 380, 420, 450], smooth: true, lineStyle: { width: 3, color: '#99CCFF' } },
                        { name: '银卡会员', type: 'line', data: [120, 150, 180, 210, 230, 260], smooth: true, lineStyle: { width: 3, color: '#A3D9C3' } },
                        { name: '金卡会员', type: 'line', data: [60, 75, 90, 105, 120, 135], smooth: true, lineStyle: { width: 3, color: '#F0C0D9' } },
                        { name: '钻石会员', type: 'line', data: [20, 30, 45, 55, 70, 85], smooth: true, lineStyle: { width: 3, color: '#FFE0B3' } }
                    ]
                });
            }
        }, 800);
    }

    // 6. 用户模块专属：根据用户类型获取统一色系颜色
    function getColor(typeId) {
        const colorMap = { 
            1: '#99CCFF',   // 主色蓝（普通会员）
            2: '#A3D9C3',   // 薄荷绿（银卡会员）
            3: '#F0C0D9',   // 藕粉（金卡会员）
            4: '#FFE0B3'    // 杏黄（钻石会员）
        };
        return colorMap[typeId] || '#99CCFF';
    }

    // 表单渲染（确保用户表单下拉框正常显示）
    form.render();
});