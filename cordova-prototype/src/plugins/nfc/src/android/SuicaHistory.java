package com.superneko.sexydynamite.bosom.plugin.nfc;

public class SuicaHistory {
    private int remain;
    private String title;

    public SuicaHistory(String title, int remain) {
        this.title = title;
        this.remain = remain;
    }

    public int getRemain() {
        return this.remain;
    }

    public String getTitle() {
        return this.title;
    }
}
