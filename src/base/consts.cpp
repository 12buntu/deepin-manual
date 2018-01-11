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

#include "base/consts.h"

namespace dman {

const char kAppName[] = "deepin-manual";
const char* kAppDisplayName = "Deepin Manual";
const char kAppVersion[] = "2.0.0";
const char kIndexPage[] = DMAN_RESOURCE_DIR "/index.html";

QString GetCacheDir() {
  const char kAppCacheDir[] = ".cache/deepin/deepin-manual";
  return QDir::home().absoluteFilePath(kAppCacheDir);
}

}  // namespace dman