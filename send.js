var amqp = require('amqplib/callback_api');

//创建连接
amqp.connect('amqp://localhost', function (err, conn) {
    //创建通道
    conn.createChannel(function (err, ch) {
        //声明队列
        var queue = 'hello';

        ch.assertQueue(queue, {
            durable: false
        });

        //发送消息到队列
        // Note: on Node 6 Buffer.from(msg) should be used
        var msg = 'Hello World!';
        ch.sendToQueue(queue, new Buffer(msg));
        
        console.log(" [x] Sent %s", msg);
    });

    //设置500毫秒后关闭连接
    setTimeout(function () {
        conn.close();
        process.exit(0);
    }, 500);
});