/*
 * Copyright (C) 2017 ~ 2017 Deepin Technology Co., Ltd.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

#include <QApplication>
#include <qcef_context.h>

#include "base/consts.h"
#include "controller/window_manager.h"

int main(int argc, char** argv) {
  if (argc == 1) {
    fprintf(stderr, "Usage: %s app-name\n", argv[0]);
    return 0;
  }

  QCefGlobalSettings settings;

  // Do not use sandbox.
  settings.setNoSandbox(true);

#ifndef N_DEBUG
  // Open http://localhost:9222 in chromium browser to see dev tools.
  settings.setRemoteDebug(true);
  settings.setLogSeverity(QCefGlobalSettings::LogSeverity::Info);
#else
  settings.setRemoteDebug(false);
  settings.setLogSeverity(QCefGlobalSettings::LogSeverity::Error);
#endif

  // Disable GPU process.
  settings.addCommandLineSwitch("--disable-gpu", "");

  const int exit_code = QCefInit(argc, argv, settings);
  if (exit_code >= 0) {
    return exit_code;
  }

  QApplication app(argc, argv);
  QCefBindApp(&app);
  app.setApplicationVersion(dman::kAppVersion);
  app.setApplicationName(dman::kAppName);
  // FIXME(Shaohua): Translation not work.
  app.setApplicationDisplayName(QObject::tr(dman::kAppDisplayName));

  dman::WindowManager window_manager;
  const QStringList args = app.arguments();
  for (int i = 1; i < args.length(); ++i) {
    window_manager.openManual(args.at(i));
  }

  return app.exec();
}