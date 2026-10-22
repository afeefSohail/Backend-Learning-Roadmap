/// Same rules as src/validators/auth.validators.ts, checked on the device
/// so users see the reason before a round trip.
class Validators {
  Validators._();

  static final _email = RegExp(r'^[^@\s]+@[^@\s]+\.[^@\s]+$');

  static String? email(String? v) {
    final value = v?.trim() ?? '';
    if (value.isEmpty) return 'Email is required';
    if (!_email.hasMatch(value)) return 'Invalid email address';
    return null;
  }

  /// signUpSchema: min 8, one uppercase, one number.
  /// The backend trims the password on sign-up but not on login, so a
  /// password with leading/trailing spaces could never log in. Block it here.
  static String? newPassword(String? v) {
    final value = v ?? '';
    if (value.isEmpty) return 'Password is required';
    if (value != value.trim()) return 'Password cannot start or end with a space';
    if (value.length < 8) return 'Password must be at least 8 characters';
    if (!RegExp(r'[A-Z]').hasMatch(value)) return 'Password must contain at least one uppercase letter';
    if (!RegExp(r'[0-9]').hasMatch(value)) return 'Password must contain at least one number';
    return null;
  }

  /// loginSchema: min 2.
  static String? loginPassword(String? v) {
    if ((v ?? '').length < 2) return 'Password is required';
    return null;
  }

  /// signUpSchema: optional, but at least 5 characters when given.
  static String? optionalName(String? v) {
    final value = v?.trim() ?? '';
    if (value.isEmpty) return null;
    if (value.length < 5) return 'Name must be at least 5 characters';
    return null;
  }

  /// Profile edit: PATCH /user/me has no validation, but keep the sign-up rule.
  static String? requiredName(String? v) {
    final value = v?.trim() ?? '';
    if (value.isEmpty) return 'Name is required';
    return optionalName(value);
  }

  static String? Function(String?) confirm(String Function() original) =>
      (v) => v == original() ? null : 'Passwords do not match';
}
