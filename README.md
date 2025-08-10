# Giphy App

A project with automated Linear integration via GitHub Actions.

## Linear Integration

This repository is configured to automatically respond to Linear issue webhooks. When a new issue is created in Linear, the following automation happens:

### Automatic Workflow

1. **Webhook Trigger**: Linear sends a webhook to our Vercel function
2. **GitHub Dispatch**: The webhook triggers a `repository_dispatch` event
3. **Branch Creation**: A new branch is created named `linear-{issueId}`
4. **Issue Tracking**: A markdown file is created in `/issues/` with issue details
5. **Pull Request**: An automatic PR is opened for the Linear issue
6. **Ready for Development**: The branch is ready for implementing the solution

### Webhook URL

The Linear webhook should point to: `https://your-vercel-domain.vercel.app/api/webhook`

### Workflow Features

- ✅ Automatic branch creation for each Linear issue
- ✅ Issue tracking files with Linear metadata
- ✅ Pull requests linked to Linear issues
- ✅ Structured development workflow
- ✅ Automated comments and summaries

### File Structure

```
.github/workflows/
  └── linear-webhook.yml    # Main workflow for Linear integration
issues/
  └── {issueId}.md         # Auto-generated issue tracking files
```

### Development Workflow

1. Linear issue created → Automatic branch & PR created
2. Developer checks out the branch: `git checkout linear-{issueId}`
3. Implement the solution
4. Push changes to the branch
5. Review and merge the PR
6. Issue can be updated/closed in Linear

## Getting Started

1. Clone the repository
2. Check for any open PRs created from Linear issues
3. Checkout the relevant branch and start developing
4. Follow the tasks outlined in the issue tracking file

---

*This repository uses automated Linear integration powered by Vercel serverless functions and GitHub Actions.*
