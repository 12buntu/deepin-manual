#! /usr/bin/env python
# -*- coding: utf-8 -*-

# Copyright (C) 2011~2012 Deepin, Inc.
#               2011~2012 Kaisheng Ye
#
# Author:     Kaisheng Ye <kaisheng.ye@gmail.com>
# Maintainer: Kaisheng Ye <kaisheng.ye@gmail.com>
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.

import os, sys
from constant import CONFIG_FILE_PATH, LANGUAGE
from deepin_utils.config import Config
from deepin_utils.file import touch_file
import traceback
from collections import OrderedDict

def get_home_item_values():
    ini = Config(CONFIG_FILE_PATH)
    ini.load()
    books = eval(ini.get("config", "book"))
    home_item_values = OrderedDict()
    for book in books:
        write_book_pages_id_to_config(book[0])
        item = {}
        item["book"] = book[0]
        item["title"] = book[1]
        item["icon_path"] = "../%s/%s/icon.png" % (LANGUAGE, book[0])
        home_item_values[book[0]] = item

    return home_item_values

def get_book_contents(book):
    json_file = os.path.realpath("../contents/%s/%s/content.json" % (LANGUAGE, book))
    try:
        content_dict = eval(open(json_file).read())
    except Exception:
        print "there is something wrong in content file: %s" % json_file
        traceback.print_exc(file=sys.stdout)
        sys.exit(1)

    for chapter in content_dict["content"]:
        for page in chapter["page"]:
            # image path for html file
            page["image"] = "../%s/%s/%s" % (LANGUAGE, book, page["image"])

    return content_dict

def get_book_pages_id(book):
    data = []
    book_contents = get_book_contents(book)
    chapters = book_contents["content"]
    for chapter_index in range(len(chapters)):
        pages = []
        for page in chapters[chapter_index]["page"]:
            pages.append(page["id"])
        data.append(pages)

    return data

def get_progress_config():
    progress_file = os.path.expanduser("~/.config/deepin-user-manual/progress.ini")
    progress_config = Config(progress_file)

    if os.path.exists(progress_file):
        progress_config.load()
    else:
        touch_file(progress_file)
        progress_config.load()

    return progress_config

def write_book_pages_id_to_config(book):
    ids = str(get_book_pages_id(book))
    progress_config = get_progress_config()
    if (not progress_config.has_option("all", book)) or (progress_config.get("all", book) != ids):
        progress_config.set("all", book, ids)
        progress_config.write()

def get_book_unread_pages(book):
    progress_config = get_progress_config()
    all_pages_id = eval(progress_config.get("all", book))
    chapter_num = len(all_pages_id)
    if progress_config.has_option("unread", book):
        unread_pages_id = eval(progress_config.get("unread", book))
        if len(unread_pages_id) == chapter_num:
            for i in range(chapter_num):
                if set(unread_pages_id[i]) > set(all_pages_id[i]):
                    return all_pages_id
            return unread_pages_id
    progress_config.set("unread", book, str(all_pages_id))
    progress_config.write()
    return all_pages_id

def write_unread_pages_data(home_value):
    progress_config = get_progress_config()
    for key in home_value:
        book = key
        unread_pages = home_value[key]["unread_pages"]
        progress_config.set("unread", book, str(unread_pages))
        progress_config.write()

def write_last_page(last_page):
    progress_config = get_progress_config()
    progress_config.set("last", "page", str(last_page))
    progress_config.write()

def get_last_page():
    progress_config = get_progress_config()
    if progress_config.has_option("last", "page"):
        return eval(progress_config.get("last", "page"))
    else:
        last_page = {}
        home_values = get_home_item_values()
        for key in home_values:
            last_page[key] = [0, "A1"]
        write_last_page(last_page)
        return last_page

if __name__ == "__main__":
    m = get_home_item_values()
    for i in m:
        print m[i]
