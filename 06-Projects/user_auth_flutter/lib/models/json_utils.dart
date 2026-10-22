/// Reads a value by camelCase key, falling back to snake_case,
/// so the models work whichever style the backend uses.
T? pick<T>(Map<String, dynamic> json, String camel, [String? snake]) {
  final value = json[camel] ?? (snake != null ? json[snake] : null);
  return value is T ? value : null;
}

DateTime? pickDate(Map<String, dynamic> json, String camel, [String? snake]) {
  final raw = pick<String>(json, camel, snake);
  return raw == null ? null : DateTime.tryParse(raw);
}

/// Ids may arrive as int or string; normalise to string.
String pickId(Map<String, dynamic> json) {
  final raw = json['id'] ?? json['_id'];
  return raw?.toString() ?? '';
}
