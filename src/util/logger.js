import chalk from 'chalk'
const reTime = /\d{2}:\d{2}:\d{2}/
const time = () => new Date().toString().match(reTime)[0]

export default {
  info (...msg) {
    console.log(
      `[%s] [%s] %s`,
      chalk.yellow(time()),
      chalk.green('info'),
      ...msg
    )
  },
  error (msg) {
    console.log(
      `[%s] [%s] %s`,
      chalk.yellow(time()),
      chalk.red('error'),
      chalk.red(msg.toString())
    )
  }
}
