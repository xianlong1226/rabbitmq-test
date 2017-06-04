var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function (err, conn) {
    conn.createChannel(function (err, ch) {
        var q = 'task_queue';
        var msg = process.argv.slice(2).join(' ') || "Hello World!";

        //声明一个队列并且设置持久化，即使RabbitMQ重启了也不丢失
        ch.assertQueue(q, {
            durable: true
        });
        //发送消息并且设置持久化，即使RabbitMQ重启了也不丢失
        ch.sendToQueue(q, new Buffer(msg), {
            persistent: true
        });
        console.log(" [x] Sent '%s'", msg);
    });
    setTimeout(function () {
        conn.close();
        process.exit(0)
    }, 500);
});