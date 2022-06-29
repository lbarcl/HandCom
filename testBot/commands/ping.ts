import {Command} from '../../index'

const command = new Command.Command('ping');
command.Func = ({message}) => { 
    message.channel.send('pong');
};

module.exports = command;