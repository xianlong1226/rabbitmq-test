var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function (err, conn) {
    conn.createChannel(function (err, ch) {
        var ex = 'direct_logs';
        var args = process.argv.slice(2);
        var msg = args.slice(1).join(' ') || 'Hello World!';
        var severity = (args.length > 0) ? args[0] : 'info';
        //声明一个direct类型的exchange
        ch.assertExchange(ex, 'direct', {
            durable: false
        });
        //发布某个key消息到该exchange，该消息会被转发到绑定对应key的队列中
        ch.publish(ex, severity, new Buffer(msg));
        console.log(" [x] Sent %s: '%s'", severity, msg);
    });

    setTimeout(function () {
        conn.close();
        process.exit(0)
    }, 500);
});