/** 广播消息 */
var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function (err, conn) {
    conn.createChannel(function (err, ch) {
        var msg = process.argv.slice(2).join(' ') || 'Hello World!';

        //声明一个fanout类型的exchange
        var ex = 'logs';
        ch.assertExchange(ex, 'fanout', {
            durable: false
        });
        //发送消息到exchange而不是某个具体队列，这样，和该exchange绑定的队列都会收到该消息
        ch.publish(ex, '', new Buffer(msg));
        console.log(" [x] Sent %s", msg);
    });

    setTimeout(function () {
        conn.close();
        process.exit(0)
    }, 500);
});