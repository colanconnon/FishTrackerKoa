#!/bin/bash
cat dbbackup.txt |  psql -h localhost -p 54322 -d docker -U docker