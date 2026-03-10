
# Changelog

All notable changes to this project will be documented in this file.

## [1.12.0] - 2026-03-10

### Added
- New `--version` / `-V` option to show the current version number
- Updated package.json to reflect current version (1.12.0)
- Added version option to help text for better discoverability

## [1.11.0] - 2026-03-10

### Added
- New `--dry-run` option (alias for `--preview`) for users familiar with dry-run terminology
- New `--since <date>` option to only organize files modified after a specific date (ISO format, e.g., 2026-03-01)
- Supported for all organize commands (--type, --date, --extension)
- Helps with incremental organizing, only touching new/modified files

## [1.10.0] - 2026-03-09

### Added
- Enhanced `report` command with detailed statistics
- Now shows total file count, directory count, total size (formatted), file type counts, and top 20 extensions
- New `--recursive` / `-r` option for report command to scan subdirectories too
- Pretty printed output for easy reading + JSON output for machine readability

## [1.9.0] - 2026-03-09

### Added
- New `--extension` option for organize command to organize files directly by file extension
- New `--quiet` / `-q` option to suppress all output (great for scripts/cron jobs)
- --extension option supported for watch command too!
- Now you can organize files into folders like "JPG", "PNG", "PDF", "MD" for finer-grained control

## [1.8.0] - 2026-03-08

### Added
- Example config file (`config.example.json`) with more file types
- Added support for archives (.zip, .rar, .7z, .tar, .gz, .bz2)
- Added support for design files (.psd, .ai, .sketch, .fig, .xd, .xcf)
- Added more default exclude patterns (.venv, __pycache__, *.pyc)
- Easier to customize: just copy config.example.json to ~/.config/file-organizer.json and modify!

## [1.7.0] - 2026-03-08

### Added
- One-click install script (`install.sh`) for Linux/macOS users
- Even easier to get started: just `curl -sSL https://raw.githubusercontent.com/luachuan/local-file-organization/master/install.sh | bash`
- Automatic npm check and installation
- Friendly post-install instructions with quick examples

## [1.6.0] - 2026-03-08

### Added
- New `--verbose` / `-v` option for organize commands to show detailed output
- See exactly which files are being moved, skipped, or errored
- Summary report at the end with total moved/skipped/errors
- Improved help text with clearer option descriptions

## [1.5.0] - 2026-03-07

### Added
- Default exclude patterns (configurable in ~/.config/file-organizer.json)
- Auto-excludes: node_modules, .git, .DS_Store, Thumbs.db, *.tmp, *.log, .cache, .npm, .yarn
- No more accidentally organizing your git repos or node_modules!

## [1.4.0] - 2026-03-07

### Added
- Regex support for --exclude option (use /pattern/ syntax, e.g., --exclude "/\.tmp$/")
- --exclude option now supported for watch command too!
- Improved help text with exclude usage tips

## [1.3.0] - 2026-03-07

### Added
- New `--exclude` option for organize and dedupe commands to skip specific files or directories
- Supports simple wildcards (e.g., `--exclude "node_modules"`, `--exclude "*.log"`)
- Can be used multiple times to exclude multiple items
- Improved help text for better usability

## [1.2.0] - 2026-03-06

### Added
- Implemented watch mode (watch command) to monitor directories and auto-organize new files
- Supports --date flag for watch mode to organize by date instead of type
- Supports --recursive/-r flag for watch mode to monitor subdirectories

## [1.1.0] - 2026-03-06

### Added
- Recursive directory support (--recursive / -r flag) for organize and dedupe commands
- Now you can organize/dedupe files in subdirectories too!

## [1.0.0] - 2026-03-05

### Added
- Initial release of Local File Organizer
- Organize files by type (images/docs/videos/code/audio/other)
- Organize files by date (year/month)
- Remove duplicate files (hash-based)
- Preview mode - see what would happen without making changes
- Undo - one-click undo for last operation
- Watch mode - monitor a folder and auto-organize new files
- Config file - customize types and target folders at ~/.config/file-organizer.json
- 100% local - no cloud, no data leaks
- Bilingual support (English + Chinese)
- Zero-config out-of-the-box experience
