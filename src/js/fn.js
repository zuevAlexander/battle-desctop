

$().ready(function() {
    $('.dv1').Drags({
        handler: '.handler',
        onMove: function(e) {
            $('.content').html('Текущая позиция:(слева:' + e.pageX + ' , сверху:' + e.pageY + ')');
        },
        onDrop: function(e){
            $('.content').html('Прямоугольник брошен! <br />Текущая позиция:(слева:<strong>' + e.pageX + '</strong> , сверху:<strong>' + e.pageY + '</strong>)');
        }
    });

    $('.dv2').Drags({
        handler: '.gb',
        zIndex:200,
        opacity:.9
    });
});