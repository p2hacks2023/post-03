from pybleno import *
import RPi.GPIO as GPIO
import threading

bleno = Bleno()

SERVICE_UUID = '4c210b69-05e5-44e2-9ae2-c2b1a75df030'
FANCONTROL_CHARACTERISTIC_UUID = 'bde2f59b-4408-48dc-86bc-231841c8390b'

SERIAL_CODE = 'edb77dfe'

fan_pin = 4

GPIO.setwarnings(False)
GPIO.setmode(GPIO.BCM)
GPIO.setup(fan_pin,GPIO.OUT)

def fan_on():
    GPIO.output(fan_pin,True)
    print("on")

def fan_off():
    GPIO.output(fan_pin,False)
    print("off")

def run_fun_impl(sec):
    fan_on()
    time.sleep(sec)
    fan_off()

def run_fan(sec):
    threading.Thread(target=run_fun_impl, args=(sec,)).start()

class ApproachCharacteristic(Characteristic):

    def __init__(self):
        Characteristic.__init__(self, {
            'uuid': FANCONTROL_CHARACTERISTIC_UUID,
            'properties': ['read', 'write'],
            'value': None
        })

        self._value = str(0).encode()
        self._updateValueCallback = None

    def onReadRequest(self, offset, callback):
        print('ApproachCharacteristic - onReadRequest')
        callback(result=Characteristic.RESULT_SUCCESS, data=self._value)

    def onWriteRequest(self, data, offset, withoutResponse, callback):
        print('ApproachCharacteristic - onWriteRequest')
        received_value = int.from_bytes(data, byteorder='big');

        if received_value == 0 or received_value > 60:
            callback(self.RESULT_UNLIKELY_ERROR)
            return

        run_fan(received_value)

        callback(self.RESULT_UNLIKELY_ERROR)


def onStateChange(state):
    print('on -> stateChange: ' + state)

    if (state == 'poweredOn'):
        bleno.startAdvertising(name='futocool_cooling_device', service_uuids=[SERVICE_UUID])
    else:
        bleno.stopAdvertising()


bleno.on('stateChange', onStateChange)

approachCharacteristic = ApproachCharacteristic()


def onAdvertisingStart(error):
    print('on -> advertisingStart: ' + ('error ' + error if error else 'success'))

    if not error:
        bleno.setServices([
            BlenoPrimaryService({
                'uuid': SERVICE_UUID,
                'characteristics': [
                    approachCharacteristic
                ]
            })
        ])


bleno.on('advertisingStart', onAdvertisingStart)

bleno.start()


import time

counter = 0

def task():
    global counter
    counter += 1
    approachCharacteristic._value = str(counter).encode()
    if approachCharacteristic._updateValueCallback:

        print('Sending notification with value : ' + str(approachCharacteristic._value))

        notificationBytes = str(approachCharacteristic._value).encode()
        approachCharacteristic._updateValueCallback(data=notificationBytes)


while True:
    task()
    time.sleep(1)
