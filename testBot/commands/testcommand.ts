import {Command} from '../../index'

const command = new Command.Command('test');
command.Func = ({message}) => { 
    message.channel.send('Senin');
};

module.exports = command;