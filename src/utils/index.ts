import execa from 'execa';

export async function getLatestVersion(name: string) {
  const originInfo = await execa(`npm view ${name} --registry https://registry.npmjs.org/ --json`);
  return JSON.parse(originInfo.stdout)['dist-tags'].latest;
}
