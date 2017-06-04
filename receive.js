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
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

        //消费队列，接收消息
        ch.consume(queue, function (msg) {
            console.log(" [x] Received %s", msg.content.toString());
        }, {
            noAck: true
        });
    });
});