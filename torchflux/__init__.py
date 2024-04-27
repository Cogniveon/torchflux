import asyncio
import threading

from torchflux.dashboard import TorchFluxDashboard

__version__ = "0.0.1"


async def train_fn(update, lock):
    for i in range(100):
        await asyncio.sleep(1)
        async with lock:
            update(i)


def start_async_thread(coroutine):
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    loop.run_until_complete(coroutine)
    loop.close()


def create_trainer():
    """Creates a TorchFluxDashboard widget and spawns a thread"""
    widget = TorchFluxDashboard()

    lock = asyncio.Lock()
    thread = threading.Thread(
        target=start_async_thread,
        args=(train_fn(lambda x: widget.send({"type": "progress", "value": x}), lock),),
    )
    thread.start()

    return widget
