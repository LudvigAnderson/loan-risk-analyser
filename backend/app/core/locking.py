import asyncio
from contextlib import asynccontextmanager

# This class is for example used to make sure that functions that use
# an ML model can use it simultaneously, but NOT at the same time as
# the models are being loaded from Google Cloud Storage.
class AsyncRWLock:
    def __init__(self):
        self._readers = 0
        self._readers_lock = asyncio.Lock()
        self._resource_lock = asyncio.Lock()
    
    @asynccontextmanager
    async def acquire_read(self):
        await self._readers_lock.acquire()
        self._readers += 1
        if self._readers == 1:
            await self._resource_lock.acquire()
        self._readers_lock.release()
        try:
            yield
        finally:
            await self._readers_lock.acquire()
            self._readers -= 1
            if self._readers == 0:
                self._resource_lock.release()
            self._readers_lock.release()
    
    @asynccontextmanager
    async def acquire_write(self):
        await self._resource_lock.acquire()
        try:
            yield
        finally:
            self._resource_lock.release()
            