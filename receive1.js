var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function (err, conn) {
    conn.createChannel(function (err, ch) {
        var q = 'task_queue';

        //声明一个队列并且设置持久化，即使RabbitMQ重启了也不丢失
        ch.assertQueue(q, {
            durable: true
        });
        //告诉RabbitMQ一次只发送一个消息过来
        ch.prefetch(1);
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
        ch.consume(q, function (msg) {
            var secs = msg.content.toString().split('.').length - 1;

            console.log(" [x] Received %s", msg.content.toString());
            setTimeout(function () {
                console.log(" [x] Done");
                //通知RabbitMQ该消息处理完了，可以删除了
                ch.ack(msg);
            }, secs * 1000);
        }, {
            noAck: false //设置需要ack
        });
    });
});