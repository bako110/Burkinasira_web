export type PasswordIssue = 'tooShort' | 'needsUppercase' | 'needsNumber';

export function getPasswordIssues(password: string): PasswordIssue[] {
  const issues: PasswordIssue[] = [];
  if (password.length < 8) issues.push('tooShort');
  if (!/[A-Z]/.test(password)) issues.push('needsUppercase');
  if (!/[0-9]/.test(password)) issues.push('needsNumber');
  return issues;
}

export function isPasswordStrong(password: string): boolean {
  return getPasswordIssues(password).length === 0;
}
