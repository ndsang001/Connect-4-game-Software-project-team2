class Connect4 {
    constructor(selector){
        this.COL = 7;
        this.LGN = 6;
        this.selector = selector;
        this.player = 'red';

        this.drawGame();
        this.detecte();
        this.checkWin();

    } 

    
        // Display game

        drawGame(){ 
            const $jeu = $(this.selector);

            for(let lgn=0; lgn < this.LGN; lgn++){
                const $lgn = $('<div>').addClass('lgn');
                for(let col = 0; col < this.COL; col++ ){
                    const $col = $('<div>').addClass('col empty').attr("data-col", col).attr("data-lgn", lgn);
                    $lgn.append($col);
                }
                $jeu.append($lgn);
            }
            
        }

        detecte(){
            const $jeu = $(this.selector);
            const that = this;
            function lastCase(col){
                const $cells = $(`.col[data-col='${col}']`);
                for(let i = $cells.length-1; i>=0; i--){
                    const $cell = $($cells[i]);
                    if($cell.hasClass('empty')){
                        return $cell;
                    }
                }
                return null;
            }

            $jeu.on('mouseenter', '.col.empty', function(){
                const $col = $(this).data('col');
                const $last = lastCase($col);
                if($last != null){
                    $last.addClass(`p${that.player}`);
                }
            });

            $jeu.on('mouseleave', '.col', function(){
                $('.col').removeClass(`p${that.player}`);
            });

            $jeu.on('click', '.col.empty', function(){
                const col = $(this).data('col');
                const $last = lastCase(col);
                $last.addClass(`${that.player}`).removeClass(`empty p${that.player}`).data('player',`${that.player}`);
                const winner = that.checkWin($last.data('lgn'), $last.data('col'));

                that.player = (that.player === 'red') ? 'green' : 'red';

                if(winner){
                    console.log(`The winner is the ${winner} player`);
                    alert(`The winner is the ${winner} player`);
                    $(`#restart`).css('visibility',"visible")
                }
            });
        }

        checkWin(lgn, col){
            const that = this;

            function $getCell(i, j){
                return $(`.col[data-lgn='${i}'][data-col='${j}']`);
            }

            function checkDirection(direction){
                let total = 0;
                let i = lgn + direction.i;
                let j = col + direction.j;
                let $next = $getCell(i, j);
                while(i >= 0 && i < that.LGN && j >= 0 && j < that.COL && $next.data('player') === that.player){
                    total++;
                    i += direction.i;
                    j += direction.j;
                    $next = $getCell(i, j);
                }
                return total;
            }

            function checkWin(directionA, directionB){
                const total = 1 + checkDirection(directionA) + checkDirection(directionB);
                if(total>=4){
                    return that.player;
                }else{
                    return null;
                }
        
            }

            function checkHori(){
                return checkWin({i: 0, j: -1}, {i: 0, j: 1})
            }

            function checkVerti(){
                return checkWin({i: -1, j: 0}, {i: 1, j: 0})
            }

            function checkDiag1(){
                return checkWin({i: 1, j: 1}, {i: -1, j: -1})
            }
            function checkDiag2(){
                return checkWin({i: 1, j: -1}, {i: -1, j: 1})
            }

            return checkHori() || checkVerti() || checkDiag1() || checkDiag2();

        }
    
}