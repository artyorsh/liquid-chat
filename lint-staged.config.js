export default {
  '*.ts?(x)': [
    'npm run lint -- --fix',
    () => 'tsc -p ./tsconfig.json',
  ],
};
