const escapeRegex = (value: string): string =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const escapeForCharClass = (value: string): string =>
  value.replace(/[\\\]^/-]/g, '\\$&');

export interface RubyShorthandRule {
  trigger: string;
  open: string;
  close: string;
}

export interface RubyShorthandOptions {
  enabled: boolean;
  rules: RubyShorthandRule[];
}

export const DEFAULT_SHORTHAND_RULE: RubyShorthandRule = {
  trigger: '|',
  open: '《',
  close: '》',
};

export const createRubyInputRegex = (rule: RubyShorthandRule): RegExp => {
  const trigger = escapeRegex(rule.trigger);
  const open = escapeRegex(rule.open);
  const close = escapeRegex(rule.close);
  const excludedBase = [
    escapeForCharClass(rule.trigger),
    escapeForCharClass(rule.open),
    escapeForCharClass(rule.close),
    '\\s',
  ].join('');
  const excludedReading = [escapeForCharClass(rule.open), escapeForCharClass(rule.close), '\\n'].join(
    ''
  );

  return new RegExp(`${trigger}([^${excludedBase}]+)${open}([^${excludedReading}]+)${close}$`);
};

export const createRubyPasteRegex = (rule: RubyShorthandRule): RegExp => {
  const trigger = escapeRegex(rule.trigger);
  const open = escapeRegex(rule.open);
  const close = escapeRegex(rule.close);
  const excludedBase = [
    escapeForCharClass(rule.trigger),
    escapeForCharClass(rule.open),
    escapeForCharClass(rule.close),
    '\\s',
  ].join('');
  const excludedReading = [escapeForCharClass(rule.open), escapeForCharClass(rule.close), '\\n'].join(
    ''
  );

  return new RegExp(`${trigger}([^${excludedBase}]+)${open}([^${excludedReading}]+)${close}`, 'g');
};
