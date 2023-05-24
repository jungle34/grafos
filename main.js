// AutoDispose para matar gráficos previamente construídos
am4core.options.autoDispose = true;
// Variável para armazenar estado da seleção das legendas
var states = {}


/** 
 * Função para construir Gráficos pizza seguindo padrão SOMMA
 * 
 * @param target = id da div em que o gráfico sera construído
 * @param data = informações a serem mostradas no gráfico
 * @param color = possibilidade de personalização das cores do gráfico
 * @param subtitle = parametro para mostrar ou não legendas de gráfico
 * 
 */
function pieChart(target, data, colors = false, subtitle = false) {           
    let chart = am4core.create(target, am4charts.PieChart);        
    var pieSeries = chart.series.push(new am4charts.PieSeries());        
    let cores = []
    let default_colors = [
        "#064D5E",
        "#038DB2",
        "#45AAB4",
        "#6363EA",
        "#B3467A",
        "#F9637C",
        "#FE7A66",
        "#FBB45C",
        "#CCA237"                        
    ];

    // Se não houver cores definidas como parâmetro, carrega cores definidas na função
    if(colors){
        default_colors = colors
    }
    // Converte cores hexadecimais para padrão amCharts
    $.each(default_colors, function(key, item){
        cores.push(am4core.color(item))            
    });
    // Adiciona cores nos parâmetros para construção do gráfico
    pieSeries.colors.list = cores;
    // Adiciona os valores parâmetrizados para construção do gráfico
    chart.data = data;
    // Define língua local usada no gráfico
    chart.language.locale = am4lang_pt_BR;
    // Cria recorte no centro do gráfico
    chart.innerRadius = 70; //am4core.percent(90);
    chart.radius = 135; //am4core.percent(40);
    chart.ContainerLayout = "absolute";
    chart.align = "center";
    chart.y = -100;
    // Cria bordas nas fatias do gráfico
    pieSeries.slices.template.stroke = am4core.color("#FFF");
    pieSeries.slices.template.strokeWidth = 4;
    pieSeries.slices.template.strokeOpacity = 1;
    // Define padrão da legenda
    pieSeries.slices.template.tooltipText = "{category}: {value.formatNumber('#,###.00')}";
    pieSeries.slices.template
        .cursorOverStyle = [{
            "property": "cursor",
            "value": "pointer"
        }];

    pieSeries.hiddenState.properties.opacity = 1;
    pieSeries.hiddenState.properties.endAngle = -90;
    pieSeries.hiddenState.properties.startAngle = -90;

    // Define padrão de visualização dos valores nas fatias do gráfico
    pieSeries.alignLabels = true;
    pieSeries.ticks.template.disabled = true;
    pieSeries.alignLabels = false;
    pieSeries.labels.template.text = "{value.percent.formatNumber('#.0')}%";
    pieSeries.labels.template.radius = am4core.percent(-20);
    pieSeries.labels.template.fill = am4core.color("white");

    // Define os name_fields das informações parâmetrizadas
    pieSeries.dataFields.value = "valor";
    pieSeries.dataFields.category = "category";

    // Função para não mostrar valor quando não houver espaço suficiente na fatia
    pieSeries.labels.template.adapter.add("radius", function(radius, target) {
        if (target.dataItem && (target.dataItem.values.value.percent < 5)) {
            return 0;
        }
        return radius;
    });

    // Verificações para mostrar o valor externo à fatia quando valor não tiver espaço suficiente na fatia
    pieSeries.labels.template.adapter.add("fill", function(color, target) {
        if (target.dataItem && (target.dataItem.values.value.percent < 5)) {
            return am4core.color("#000");
        }
        return color;
    });

    // Estilização de sombras quando fatia for clicada
    let shadow = pieSeries.slices.template.filters.push(new am4core.DropShadowFilter);
    shadow.opacity = 0;
    let hoverState = pieSeries.slices.template.states.getKey("hover");
    let hoverShadow = hoverState.filters.push(new am4core.DropShadowFilter);
    hoverShadow.opacity = 0.7;
    hoverShadow.blur = 5;

    // Validação para mostrar ou não legendas do gráfico
    if(subtitle){
        chart.legend = new am4charts.Legend();
        chart.legend.labels.template.fill = "#BABFC5";
        chart.legend.labels.template.fontFamily = "Lato";
        chart.legend.labels.template.fontSize = 12;
        chart.legend.labels.template.maxColumns = 2;
        chart.legend.labels.template.fontWeight = 700;
        chart.legend.labels.template.position = "bottom";
        chart.legend.valueLabels.template.disabled = true;
        chart.legend.position = "absolute";
        chart.legend.y = 450;
    }

    // Configuração de markers de legenda do gráfico
    chart.legend.useDefaultMarker = true;
    let marker = chart.legend.markers.template.children.getIndex(0);
    marker.cornerRadius(12, 12, 12, 12);
    marker.strokeWidth = 0;
    marker.strokeOpacity = 0;
    marker.stroke = am4core.color("#FFF");

    // Event handler para usar elemento clicado para outra requisições
    chart.legend.itemContainers.template.events.on("hit", function(ev) {
        let target = strClear(ev.target.dataItem.name)

        if(states[target] == undefined || states[target] == false){
            states[target] = true
        }else{
            states[target] = false
        }

        console.log(states)
    });
}
