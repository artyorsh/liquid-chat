export default {
  '*.ts?(x)': [
    'bun run lint --cache --fix',
    () => 'tsc -p ./tsconfig.json',
  ],
};
