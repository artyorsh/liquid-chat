export default {
  '*.ts?(x)': [
    'bun run lint --fix',
    () => 'tsc -p ./tsconfig.json',
  ],
};
