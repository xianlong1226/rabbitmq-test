var amqp = require('amqplib/callback_api');

var args = process.argv.slice(2);

if (args.length == 0) {
    console.log("Usage: receive_logs_direct.js [info] [warning] [error]");
    process.exit(1);
}

amqp.connect('amqp://localhost', function (err, conn) {
    conn.createChannel(function (err, ch) {
        //声明一个direct类型的exchange
        var ex = 'direct_logs';
        ch.assertExchange(ex, 'direct', {
            durable: false
        });
        //声明队列传入空字符串表示让RabbitMQ生成一个随机队列
        ch.assertQueue('', {
            exclusive: true
        }, function (err, q) {
            console.log(' [*] Waiting for logs. To exit press CTRL+C');
            //将产生的随机队列与exchange绑定，exhange将符合对应key的消息转发到该队列
            args.forEach(function (severity) {
                ch.bindQueue(q.queue, ex, severity);
            });
            //监听消息
            ch.consume(q.queue, function (msg) {
                console.log(" [x] %s: '%s'", msg.fields.routingKey, msg.content.toString());
            }, {
                noAck: true
            });
        });
    });
});