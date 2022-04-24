// $('#game').ready(function(){
//     const connect4 = new Connect4('#game');

//     $('#restart').on('click', function(){
//         $('#game').empty();
//         connect4.drawGame();
//         $('#restart').css('visibility', 'hidden');
//     })
// });


$('#game').ready(function() {
    // const connect4 = new Connect4('#game');

    $('#2players').on('click', function() {

        const connect4 = new Connect4('#game');

        $('#2players').css('visibility', 'hidden');
        $('#vscomputer').css('visibility', 'hidden');

        {
            $('#restart').on('click', function() {
                $('#game').empty();
                connect4.drawGame();
                $('#restart').css('visibility', 'hidden');
            })
        }
    })

    $('#vscomputer').on('click', function() {
            window.location.href = './html/pcModePage.html'
        })
        // $('#vscomputer').on('click', function(){

    //     const connect4 = new Pc('#game');

    //     $('#2players').css('visibility', 'hidden');
    //     $('#vscomputer').css('visibility', 'hidden');

    //     {
    //         $('#restart').on('click', function(){
    //             $('#game').empty();
    //             connect4.drawGame();
    //             $('#restart').css('visibility', 'hidden');
    //         })
    //     }
    // })
});