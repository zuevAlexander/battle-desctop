<?php
/**
 * Created by jenking-test-versioning.
 * User: ssp
 * Date: 29.12.16
 * Time: 19:07
 */

$currentBranch = getCurrentBranch();

echo 'CURRENT BRANCH: '.$currentBranch;

if ($currentBranch != 'develop') {
    $currentVersion = getCurrentVersion();

    $newVersion = incrementForFix($currentVersion);

    echo 'NEW VERSION '.$newVersion.' FOR BRANCH '.$currentBranch;

    addGitTagForCurrentBranch($newVersion);

    mergeIntoDevelop($currentBranch);

    shell_exec('git push origin '.$newVersion);
}

function getCurrentBranch()
{
    return str_replace('origin/', '', getenv('GIT_BRANCH'));
}

function incrementForFix($currentVersion)
{
    $versionPath = explode('.', $currentVersion);

    if (count($versionPath) == 2) {
        $nextVersion = implode('.', $versionPath).'.1';
    } else {
        $versionPath[count($versionPath) - 1]++;
        $nextVersion = implode('.', $versionPath);
    }

    return $nextVersion;
}

function addGitTagForCurrentBranch($newTag)
{
    shell_exec('git tag '.$newTag.' -m"'.$newTag.'"');
}

function mergeIntoDevelop($currentBranch)
{
    shell_exec('git checkout develop');
    shell_exec('git merge --no-ff origin/'.$currentBranch);
    shell_exec('git push origin develop');
}

/**
 * @return string
 */
function getCurrentVersion()
{
    shell_exec('git fetch --tags');

    return trim(shell_exec('git describe --abbrev=0 --tags'));
}