'use strict';
import {Uri} from 'vscode';
import Git from './git';
import * as path from 'path';

export interface IGitEnricher<T> {
    enrich(data: string, ...args: any[]): T;
}

export interface IGitBlame {
    repoPath: string;
    authors: Map<string, IGitAuthor>;
    commits: Map<string, IGitCommit>;
    lines: IGitCommitLine[];
}

export interface IGitBlameLine {
    author: IGitAuthor;
    commit: IGitCommit;
    line: IGitCommitLine;
}

export interface IGitBlameLines extends IGitBlame {
    allLines: IGitCommitLine[];
}

export interface IGitBlameCommitLines {
    author: IGitAuthor;
    commit: IGitCommit;
    lines: IGitCommitLine[];
}

export interface IGitAuthor {
    name: string;
    lineCount: number;
}

export interface IGitCommit {
    repoPath: string;
    sha: string;
    fileName: string;
    author: string;
    date: Date;
    message: string;
    lines: IGitCommitLine[];
    originalFileName?: string;
    previousSha?: string;
    previousFileName?: string;

    readonly isUncommitted: boolean;
    previousUri: Uri;
    uri: Uri;
}

export class GitCommit implements IGitCommit {
    lines: IGitCommitLine[];
    originalFileName?: string;
    previousSha?: string;
    previousFileName?: string;
    private _isUncommitted: boolean|undefined;

    constructor(public repoPath: string, public sha: string, public fileName: string, public author: string, public date: Date, public message: string,
                lines?: IGitCommitLine[], originalFileName?: string, previousSha?: string, previousFileName?: string) {
        this.lines = lines || [];
        this.originalFileName = originalFileName;
        this.previousSha = previousSha;
        this.previousFileName = previousFileName;
    }

    get isUncommitted(): boolean {
        if (this._isUncommitted === undefined) {
            this._isUncommitted = Git.isUncommitted(this.sha);
        }
        return this._isUncommitted;
    }

    get previousUri(): Uri {
        return this.previousFileName ? Uri.file(path.join(this.repoPath, this.previousFileName)) : this.uri;
    }

    get uri(): Uri {
        return Uri.file(path.join(this.repoPath, this.originalFileName || this.fileName));
    }
}

export interface IGitCommitLine {
    sha: string;
    previousSha?: string;
    line: number;
    originalLine: number;
    code?: string;
}

export interface IGitLog {
    repoPath: string;
    authors: Map<string, IGitAuthor>;
    commits: Map<string, IGitCommit>;
}