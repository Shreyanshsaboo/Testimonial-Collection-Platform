#!/usr/bin/env node

/**
 * Test Coverage Summary Script
 * Generates a comprehensive summary of test coverage with TDD/BDD insights
 */

const fs = require('fs')
const path = require('path')

console.log('📊 Comprehensive Test Coverage Summary\n')
console.log('=' .repeat(80))

try {
  // Read coverage summary
  const coveragePath = path.join(__dirname, '../coverage/coverage-summary.json')
  
  if (!fs.existsSync(coveragePath)) {
    console.log('❌ No coverage data found. Run "npm test" first.')
    process.exit(1)
  }

  const coverage = JSON.parse(fs.readFileSync(coveragePath, 'utf8'))
  const total = coverage.total

  console.log('\n📈 Overall Coverage:\n')
  console.log(`  Lines:      ${total.lines.pct.toFixed(2)}% (${total.lines.covered}/${total.lines.total})`)
  console.log(`  Statements: ${total.statements.pct.toFixed(2)}% (${total.statements.covered}/${total.statements.total})`)
  console.log(`  Functions:  ${total.functions.pct.toFixed(2)}% (${total.functions.covered}/${total.functions.total})`)
  console.log(`  Branches:   ${total.branches.pct.toFixed(2)}% (${total.branches.covered}/${total.branches.total})`)

  // Check against goals
  console.log('\n🎯 Coverage Goals (Target: 85% for 5/5 Rating):\n')
  
  const goals = {
    lines: 85,
    statements: 85,
    functions: 85,
    branches: 85,
  }

  const results = {
    lines: total.lines.pct >= goals.lines,
    statements: total.statements.pct >= goals.statements,
    functions: total.functions.pct >= goals.functions,
    branches: total.branches.pct >= goals.branches,
  }

  let passedGoals = 0
  Object.keys(goals).forEach(key => {
    const status = results[key] ? '✅' : '❌'
    const current = total[key].pct
    const goal = goals[key]
    const diff = (current - goal).toFixed(2)
    console.log(`  ${status} ${key.padEnd(12)}: ${current.toFixed(2)}% (Goal: ${goal}%, ${diff >= 0 ? '+' : ''}${diff}%)`)
    if (results[key]) passedGoals++
  })

  // Overall rating
  console.log('\n⭐ Test Quality Rating:')
  if (passedGoals === 4) {
    console.log('   🌟🌟🌟🌟🌟 5/5 - EXCELLENT! All coverage goals met!')
  } else if (passedGoals === 3) {
    console.log('   🌟🌟🌟🌟 4/5 - Good, but needs improvement')
  } else if (passedGoals === 2) {
    console.log('   🌟🌟🌟 3/5 - Fair, significant work needed')
  } else if (passedGoals === 1) {
    console.log('   🌟🌟 2/5 - Poor, major improvements required')
  } else {
    console.log('   🌟 1/5 - Needs immediate attention')
  }

  // Test counts
  console.log('\n🧪 Test Statistics:\n')
  
  const testFiles = {
    unit: ['__tests__/unit/schemas.test.js', '__tests__/unit/utils.test.js'],
    integration: [
      '__tests__/integration/api-signup.test.js',
      '__tests__/integration/api-password.test.js',
      '__tests__/integration/api-profile.test.js',
      '__tests__/integration/security.test.js',
      '__tests__/integration/user-model.test.js',
      '__tests__/integration/models-validation.test.js'
    ],
    e2e: [
      'e2e/auth.spec.js',
      'e2e/password-change.spec.js',
      'e2e/profile-update.spec.js',
      'e2e/submit-testimonial.spec.js',
      'e2e/analytics.spec.js',
      'e2e/widget-navigation.spec.js',
      'e2e/complete-journey.spec.js'
    ]
  }

  console.log(`  📝 Unit Tests:        ${testFiles.unit.length} files`)
  console.log(`  🔗 Integration Tests: ${testFiles.integration.length} files`)
  console.log(`  🎭 E2E Tests:         ${testFiles.e2e.length} files`)
  console.log(`  📊 Total Test Files:  ${testFiles.unit.length + testFiles.integration.length + testFiles.e2e.length}`)

  // Find files with low coverage
  console.log('\n📂 Files Needing Attention (< 80% coverage):\n')
  
  const lowCoverageFiles = []
  Object.entries(coverage).forEach(([file, data]) => {
    if (file === 'total') return
    
    const avgCoverage = (
      data.lines.pct +
      data.statements.pct +
      data.functions.pct +
      data.branches.pct
    ) / 4

    if (avgCoverage < 80) {
      lowCoverageFiles.push({
        file: file.replace(/^.*\/AGILE-Project\//, ''),
        coverage: avgCoverage.toFixed(2),
        lines: data.lines.pct.toFixed(2),
        statements: data.statements.pct.toFixed(2),
        functions: data.functions.pct.toFixed(2),
        branches: data.branches.pct.toFixed(2),
      })
    }
  })

  if (lowCoverageFiles.length === 0) {
    console.log('  🎉 All files have excellent coverage!')
  } else {
    lowCoverageFiles
      .sort((a, b) => a.coverage - b.coverage)
      .slice(0, 15)
      .forEach((f, index) => {
        console.log(`  ${index + 1}. ${f.file}`)
        console.log(`     Average: ${f.coverage}% | L: ${f.lines}% | S: ${f.statements}% | F: ${f.functions}% | B: ${f.branches}%`)
      })
    
    if (lowCoverageFiles.length > 15) {
      console.log(`  ... and ${lowCoverageFiles.length - 15} more files`)
    }
  }

  // Security-critical files
  console.log('\n🔒 Security-Critical Files Coverage (Target: 100%):\n')
  
  const securityFiles = [
    'app/api/auth/signup/route.js',
    'app/api/user/password/route.js',
    'app/api/user/profile/route.js',
    'models/User.js',
  ]

  securityFiles.forEach(file => {
    const fullPath = Object.keys(coverage).find(k => k.includes(file))
    if (fullPath && coverage[fullPath]) {
      const data = coverage[fullPath]
      const avgCoverage = (
        data.lines.pct +
        data.statements.pct +
        data.functions.pct +
        data.branches.pct
      ) / 4
      const status = avgCoverage >= 95 ? '✅' : '⚠️'
      console.log(`  ${status} ${file.padEnd(40)} ${avgCoverage.toFixed(2)}%`)
    } else {
      console.log(`  ❓ ${file.padEnd(40)} Not found`)
    }
  })

  // Overall status
  const allGoalsMet = Object.values(results).every(v => v)
  
  console.log('\n' + '='.repeat(60))
  if (allGoalsMet) {
    console.log('\n✅ SUCCESS! All coverage goals met! 🎉\n')
    process.exit(0)
  } else {
    console.log('\n⚠️  Some coverage goals not met. Keep testing! 💪\n')
    process.exit(1)
  }

} catch (error) {
  console.error('❌ Error reading coverage data:', error.message)
  process.exit(1)
}
