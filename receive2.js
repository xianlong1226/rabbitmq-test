/** 接收广播消息 */
var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function (err, conn) {
    conn.createChannel(function (err, ch) {
        //声明一个fanout类型的exchange
        var ex = 'logs';
        ch.assertExchange(ex, 'fanout', {
            durable: false
        });

        //声明队列传入空字符串表示让RabbitMQ生成一个随机队列
        ch.assertQueue('', {
            exclusive: true //程序断开该队列会被删除
        }, function (err, q) {
            console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q.queue);
            //将产生的随机队列与exchange绑定，这样发送到该exchange里的消息会被转发到该队列
            ch.bindQueue(q.queue, ex, '');
            //监听该队列的消息
            ch.consume(q.queue, function (msg) {
                console.log(" [x] %s", msg.content.toString());
            }, {
                noAck: true
            });
        });
    });
});