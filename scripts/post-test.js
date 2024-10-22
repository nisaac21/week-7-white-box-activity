(function() {

  'use strict';

  const path = require('path');
  const fs = require('fs');

  const outputDir = path.resolve(__dirname, '..', 'reports', 'coverage');
  const coveragePath = path.resolve(__dirname, '..', 'reports', 'coverage', 'coverage-summary.json');
  const testSummaryPath = path.resolve(__dirname, '..', 'reports', 'coverage', 'test-summary.json');

  const gradeForNewTestsAdded = {
    score: 0,
    name: 'New Tests Added',
    output: `New tests added: 0/10`,
    status: 'passed'
  }

  const gradeForNewBranchesCovered = {
    score: 0,
    name: 'New Branches Covered',
    output: `New branches covered: 0/20`,
    status: 'passed'
  }

  if(fs.existsSync(coveragePath) && fs.existsSync(testSummaryPath)) {
    const coverage = JSON.parse(fs.readFileSync(coveragePath, 'utf8'));
    const testSummary = JSON.parse(fs.readFileSync(testSummaryPath, 'utf8'));

    let newBranchesCovered = coverage.total.branches.covered - 24;
    let newTestsAdded = testSummary.numPassedTests - 69;

    if (newBranchesCovered > 20) {
      newBranchesCovered = 20;
    } else if (newBranchesCovered < 0) {
      newBranchesCovered = 0;
    }

    if (newTestsAdded > 10) {
      newTestsAdded = 10;
    } else if (newTestsAdded < 0) {
      newTestsAdded = 0;
    }

    gradeForNewTestsAdded.score = newTestsAdded * 5;
    gradeForNewTestsAdded.output = `New tests added: ${newTestsAdded}/10`;

    gradeForNewBranchesCovered.score = newBranchesCovered * 2.5;
    gradeForNewBranchesCovered.output = `New branches covered: ${newBranchesCovered}/20`;

  }

  console.log('');
  console.log(gradeForNewTestsAdded.output);
  console.log(gradeForNewBranchesCovered.output);
  console.log(`Grade: ${(gradeForNewTestsAdded.score + gradeForNewBranchesCovered.score)}/100\n`);

  const gradeScopeOutput = { tests: [gradeForNewTestsAdded, gradeForNewBranchesCovered] };
  fs.writeFileSync(path.resolve(outputDir, 'gradeScopeOutput.json'), JSON.stringify(gradeScopeOutput, null, 2), 'utf8');

}());