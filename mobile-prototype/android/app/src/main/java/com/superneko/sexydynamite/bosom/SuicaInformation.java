package com.superneko.sexydynamite.bosom;

import android.content.Intent;
import android.nfc.NfcAdapter;
import android.nfc.Tag;
import android.nfc.tech.NfcF;

import java.nio.ByteBuffer;
import java.util.ArrayList;

public class SuicaInformation {
    private int remain = 0;
    public ArrayList<SuicaHistory> history = new ArrayList<>();

    private SuicaInformation(int remain) {
        this.remain = remain;
    }

    private void pushSuicaHistory(SuicaHistory historyItem) {
        this.history.add(historyItem);
    }

    static SuicaInformation fromIntent(Intent intent) {
        byte[] idm = intent.getByteArrayExtra(NfcAdapter.EXTRA_ID);

        Tag tag = (Tag) intent.getParcelableExtra(NfcAdapter.EXTRA_TAG);
        NfcF nfcF = NfcF.get(tag);

        byte[] systemCode = nfcF.getSystemCode();

        if (byteToInt(systemCode) != 0x0003) {
            throw new Error("Invalid Suica tag");
        }

        SuicaInformation suicaInfo = new SuicaInformation(0);

        byte addr = 0;
        int serviceCode = 0x090f; // サービスコマンド（Suica履歴情報）
        byte[] serviceCmd = new byte[]{(byte) (serviceCode & 0xff), (byte) (serviceCode >> 8)};
        byte[] read_wo_encryption_command = new byte[]{(byte)0x06}; // 非暗号化領域読込コマンド read_wo_encryption_command:0x06
        byte[] data = new byte[]{
                (byte) 0x01,            // サービス数
                (byte) serviceCmd[0],   // サービスコード (little endian)
                (byte) serviceCmd[1],
                (byte) 0x01,            // 同時読み込みブロック数
                (byte) 0x80, addr // ブロックリスト
        };
        int length = 16; // コマンド長(length(1)+ idm(8)+ cmd(1)+ data(6))

        ByteBuffer buff = ByteBuffer.allocate(length);
        byte byteLength = (byte)length;
        buff.put(byteLength).put(read_wo_encryption_command).put(idm).put(data);
        byte[] tranCmd = buff.array();

        byte[] response;
        //Long remain;
        //SimpleDateFormat sdf;
        //String strDate;
        //byte[] contents;
        //NumberFormat nf = NumberFormat.getCurrencyInstance();
        //nf.setMaximumFractionDigits(0);

        try {
            nfcF.connect();
            response = nfcF.transceive(tranCmd);
            while(response != null){
                if(response.length < 13){
                    break;
                }

                if((response[13] & 0xff) == 0xc7 || (response[13] & 0xff) == 0xc8){
                    //sdf = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss",Locale.JAPANESE);
                    //strDate = sdf.format(getProccessDate(byteToInt(new byte[]{response[17], response[18]}),byteToInt(new byte[]{response[19], response[20]})));
                } else {
                    //sdf = new SimpleDateFormat("yyyy/MM/dd",Locale.JAPANESE);
                    //strDate = sdf.format(getProccessDate(byteToInt(new byte[]{response[17], response[18]}),0));
                }
                //sb.append("日時：" + strDate + "\n");

                int cType = byteToInt(new byte[]{response[13]});
                //sb.append("機器：" + getConsoleType(cType) + "\n");

                int proc = byteToInt(new byte[]{response[14]});
                //sb.append("処理：" + getProcessType(proc) + "\n");

                Long remain = Long.valueOf((byteToInt(new byte[]{response[24], response[23]})));
                suicaInfo.pushSuicaHistory(new SuicaHistory("TODO", remain.intValue()));
                //sb.append("残高：" + nf.format(remain) + "\n");
                //sb.append("残高(b)：");
                //sb.append(String.format("%02X", response[24]));
                //sb.append(String.format("%02X", response[23]));
                //sb.append("\n");

                //contents = Arrays.copyOfRange(response, 10, response.length);
                //for (byte b : contents) {
                //    sb.append(String.format("%02X", b));
                //}
                //sb.append("\n");
                //sb.append("---------------------------------------------------------\n");

                addr++;
                tranCmd[tranCmd.length-1] = addr;
                response = nfcF.transceive(tranCmd);
            }
        } catch(Exception e){
            e.printStackTrace();
        } finally {
            try {
                nfcF.close();
            } catch(Exception e){
                e.printStackTrace();
            }
        }

        return suicaInfo;
    }

    static private int byteToInt(byte[] array) {
        ByteBuffer wrapped = ByteBuffer.wrap(array);

        int value = 0x0;

        for (int i = 0; i < array.length; i++) {
            value += array[i];

            if (i + 1 < array.length) {
                value = value << 8;
            }
        }
        return value;
    }
}
