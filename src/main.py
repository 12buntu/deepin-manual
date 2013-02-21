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

from deepin_utils.file import get_parent_dir
from dtk.ui.new_slider import HSlider
from color import color_hex_to_cairo
from button import SelectButton, SelectButtonGroup, ImageButton
from utils import propagate_expose
from window import Window

import os
import gtk
import cairo
import webkit
import webbrowser

LANGUAGE = "zh_CN"

def parse_content(file_path):
    s = open(file_path).read()
    return(eval(s))

class UserManual(Window):
    def __init__(self):
        Window.__init__(self)

        self._init_values()
        self._init_settings()
        self._init_wedget()
        
        self.connect("destroy", gtk.main_quit)
        self.show_all()
        gtk.main()

    def _init_values(self):
        self.width = 685
        self.height = 500
        self.titlebar_height = 62
        self.content_vlues = parse_content(os.path.realpath("../contents/%s/index.txt" % LANGUAGE))

    def _init_settings(self):
        self.set_size_request(self.width+16, self.height+16)
        self.set_decorated(False)

    def _init_wedget(self):
        self.main_alignment = gtk.Alignment(1, 1, 1, 1)
        self.main_alignment.set_padding(0, 0, 0, 0)
        self.v_box = gtk.VBox()

        self.title_bar = TitleBar()
        self.title_bar.set_size_request(self.width, self.titlebar_height)

        arrow = ImageButton("app_image/back.png", "app_image/back-press.png", "app_image/back-press.png")
        arrow_align = gtk.Alignment(0, 0.5, 0, 0)
        arrow_align.set_padding(0, 0, 13, 10)
        arrow_align.add(arrow)
        self.title_bar.h_box.pack_start(arrow_align, False, False)

        IndexWidget = gtk.VBox()

        subjects = self.content_vlues.get("content")
        self.subjects = []
        for i in range(len(subjects)):
            self.subjects.append(SelectButton("subject%s" % (i+1), subjects[i].get("title"))) 
        group = SelectButtonGroup(self.subjects)
        self.subjects[0].selected = True
        sub_left_align = gtk.Alignment(0, 0.5, 0, 0)
        sub_left_align.add(group)
        self.title_bar.h_box.pack_start(sub_left_align)

        close = ImageButton("app_image/close.png", "app_image/close-press.png", "app_image/close-press.png")
        close.connect("button-release-event", gtk.main_quit)
        close_align = gtk.Alignment(1, 0.5, 0, 0)
        close_align.set_padding(0, 0, 0, 15)
        close_align.add(close)
        self.title_bar.h_box.pack_start(close_align, False, False)

        self.v_box.pack_start(self.title_bar, False, False)

        self.web = ContentWebView("html/index.html", 
                self.width, self.height - self.titlebar_height)
        self.web_scroll_win = gtk.ScrolledWindow()
        self.web_scroll_win.add(self.web)
        self.v_box.pack_start(self.web_scroll_win, False, False)

        self.slider = HSlider()
        self.slider.to_page_now(self.main_alignment)
        self.main_alignment.add(self.v_box)
        self.add_widget(self.slider)

        arrow.connect("button-release-event", lambda w, e: self.slider.to_page(IndexWidget, "left"))

    def print_info(self, *data):
        print data

class ContentWebView(webkit.WebView):
    def __init__(self, index_file, width, height):
        webkit.WebView.__init__(self)
        self.set_size_request(width, height)

        base_uri = "file://"+get_parent_dir(index_file)+"/"
        self.index_string = open(index_file).read()
        self.load_string(self.index_string, "text/html", "utf8", base_uri)
        
        self.connect("title-changed", self.title_changed_handler)

    def title_changed_handler(self, widget, webframe, data):
        print widget
        print webframe
        print data
        webbrowser.open(data)

class TitleBar(gtk.EventBox):
    def __init__(self):
        gtk.EventBox.__init__(self)
        
        self._init_wedget()

    def _init_wedget(self):
        self.align = gtk.Alignment(1, 1, 1, 1)
        self.align.set_padding(0, 0, 0, 0)

        self.h_box = gtk.HBox()
        self.align.add(self.h_box)
        self.add(self.align)
        
        self.align.connect("expose-event", self.expose)

    def expose(self, widget, event):
        cr = widget.window.cairo_create()
        rect = widget.allocation

        cr.rectangle(*rect)
        cr.set_source_rgb(*color_hex_to_cairo("#e7e7e7"))
        #cr.set_operator(cairo.OPERATOR_SOURCE)
        cr.fill()

        cr.set_source_rgba(0, 0, 0, 0.5)
        cr.rectangle(0, rect.height-1, rect.width, 1)
        cr.fill()

        propagate_expose(widget, event)
        return True

if __name__ == "__main__":
    UserManual()
