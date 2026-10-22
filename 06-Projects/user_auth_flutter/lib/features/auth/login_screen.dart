import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/networking/api_error.dart';
import '../../shared/widgets.dart';
import 'auth_controller.dart';
import 'register_screen.dart';
import 'validators.dart';

class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({super.key, this.initialMessage});

  /// e.g. "Your session has expired".
  final String? initialMessage;

  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen> {
  final _form = GlobalKey<FormState>();
  final _email = TextEditingController();
  final _password = TextEditingController();

  bool _loading = false;
  String? _error;
  Map<String, String> _fieldErrors = const {};

  @override
  void initState() {
    super.initState();
    _error = widget.initialMessage;
  }

  @override
  void dispose() {
    _email.dispose();
    _password.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    FocusScope.of(context).unfocus();
    setState(() {
      _error = null;
      _fieldErrors = const {};
    });
    if (!_form.currentState!.validate()) return;

    setState(() => _loading = true);
    try {
      await ref.read(authControllerProvider.notifier).login(_email.text, _password.text);
      // Root widget switches to the home screen automatically.
    } catch (err) {
      final e = ApiError.from(err);
      if (!mounted) return;
      setState(() {
        _error = e.message;
        _fieldErrors = e.fieldErrors;
      });
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Scaffold(
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 420),
              child: AutofillGroup(
                child: Form(
                  key: _form,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      Icon(Icons.lock_person_rounded, size: 64, color: theme.colorScheme.primary),
                      const SizedBox(height: 16),
                      Text('Welcome back',
                          style: theme.textTheme.headlineMedium, textAlign: TextAlign.center),
                      const SizedBox(height: 4),
                      Text('Sign in to continue',
                          style: theme.textTheme.bodyLarge
                              ?.copyWith(color: theme.colorScheme.outline),
                          textAlign: TextAlign.center),
                      const SizedBox(height: 32),
                      if (_error != null) ...[ErrorBanner(_error!), const SizedBox(height: 16)],
                      TextFormField(
                        controller: _email,
                        keyboardType: TextInputType.emailAddress,
                        textInputAction: TextInputAction.next,
                        autocorrect: false,
                        autofillHints: const [AutofillHints.email, AutofillHints.username],
                        validator: Validators.email,
                        decoration: InputDecoration(
                          labelText: 'Email',
                          prefixIcon: const Icon(Icons.mail_outline),
                          errorText: _fieldErrors['email'],
                        ),
                      ),
                      const SizedBox(height: 16),
                      PasswordField(
                        controller: _password,
                        validator: Validators.loginPassword,
                        errorText: _fieldErrors['password'],
                        textInputAction: TextInputAction.done,
                        onSubmitted: (_) => _submit(),
                      ),
                      const SizedBox(height: 24),
                      LoadingButton(label: 'Sign in', loading: _loading, onPressed: _submit),
                      const SizedBox(height: 12),
                      TextButton(
                        onPressed: _loading
                            ? null
                            : () => Navigator.of(context).push(
                                  MaterialPageRoute(builder: (_) => const RegisterScreen()),
                                ),
                        child: const Text("Don't have an account? Create one"),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
