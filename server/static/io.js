/* respond to callbacks*/

var socket = io.connect();
socket.on('server msg',function (data) {
    var ele = document.createElement('p');
    ele.innerHTML = data;
    msg.appendChild(ele);
    msg.scrollTop = msg.scrollHeight;
})
socket.on('login',function () {
    socket.emit('login',prompt('Please enter your username'));// login
    btnIn.outAct();
    canvas.isMe = false;
    btnAutoin.disalbed = false;
});
socket.on('paint paths',function (paths) {
    paths = JSON.parse(paths);
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for(var k in paths) {
        if(paths[k].tag==='pts')
            Ctl.drawPts(ctx, paths[k]);//path init
        else{
            new Rect(paths[k].x,paths[k].y,paths[k].w,paths[k].h).clearOn(ctx);
        }
    }
});
socket.on('paint pts',function (pts) {
    pts = JSON.parse(pts)
    if(!pts) return;
    Ctl.drawPts(ctx, pts);
});

socket.on('reset in users',function (data) {
    data = JSON.parse(data);
    users.innerHTML = '';
    data.forEach(x=>{
        users.appendChild(utils.makeUserP(x));
    });
})
socket.on('erase',function (x,y,w,h) {
    new Rect(x,y,w,h).clearOn(ctx); 
})
socket.on('new in user',function (data) {//join
    users.appendChild(utils.makeUserP(JSON.parse(data)));
});
socket.on('out user',function (id) {
    var x = users.querySelector('#p'+id);//quit
    if(x) x.outerHTML='';
})
socket.on('in',function (data) {
    users.appendChild(utils.makeUserP(JSON.parse(data)));
    users.scrollTop = users.scrollHeight;
    btnIn.inAct();
});
socket.on('out',function (id) {
    var x = users.querySelector('#p'+id);
    if(x){
        x.outerHTML='';
        btnIn.outAct();
    }
});

socket.on('mytime',function (data) {//drawer time
    data = JSON.parse(data);// name,word:,time
    btnIn.disabled = true;
    info.player.innerText = data.name + '(yourself)';
    info.time.innerText = data.time +'s';
    info.word.innerText = data.word;
    canvas.isMe = true;
});
socket.on('othertime',function (data) {//other user time
    data = JSON.parse(data);// name,word:,time
    info.player.innerText = data.name;
    info.time.innerText = data.time +'s';
    canvas.isMe = false;
});
socket.on('update time',function (data) {
    data = JSON.parse(data);
    info.player.innerText = data.name;
    info.time.innerText = data.time +'s';
    info.word.innerText = data.word;
});
socket.on('update my time',function (data) {
    data = JSON.parse(data);
    info.time.innerText = data.time +'s';
});
socket.on('mytimeout',function (id) {
    var t = users.querySelector('#p'+id);
    if(t) t.outerHTML='';
    info.time.innerText = 'Time is up！';
    canvas.isMe = false;
    btnIn.outAct();
});
socket.on('timeout',function (d) {
    d = JSON.parse(d);
    var t = users.querySelector('#p'+d.id);
    if(t) t.outerHTML='';
    info.time.innerText = 'Time is up！';
    info.word.innerText = 'The correct answer is：'+d.word;
});
socket.on('clear paint',function () {
    ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
});
socket.on('tops',function (d) {
    d = JSON.parse(d);
    tops.innerHTML = '';
    var temp = tops.template;
    d.forEach((x,i)=>{
        temp.id = x.id;
        temp.children[0].firstElementChild.innerText = 'No'+(i+1);
        temp.children[1].firstElementChild.innerText = x.name;
        temp.children[2].firstElementChild.innerText = x.v+'times';

        var node = tops.template.cloneNode(true);
        node.removeAttribute('role');
        tops.appendChild(node);
    });
})
utils = {
    makeUserP : function (x) {
        var p = document.createElement('p'); p.id = 'p'+x.id;
        p.innerText = x.name;
        return p;
    }
}
